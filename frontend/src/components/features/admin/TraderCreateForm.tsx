"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { ApiError, createTrader } from "@/lib/api";

const schema = z.object({
  fullName: z.string().min(2, "Nome é obrigatório"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
  photoUrl: z.string().url("URL inválida").optional().or(z.literal("")),
  age: z.preprocess(
    (value) => (value === "" ? undefined : value),
    z.coerce
      .number()
      .int("Idade deve ser um número inteiro")
      .min(1, "Idade inválida")
      .max(120, "Idade inválida")
      .optional(),
  ),
});

type FormValues = z.infer<typeof schema>;
type FormInput = z.input<typeof schema>;

const inputClass =
  "w-full rounded-xl border border-white/10 bg-[#0E0E2E]/80 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/30 focus:border-brand-blue-light md:text-base";

const labelClass = "text-sm font-medium text-white";

export function TraderCreateForm() {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormInput, unknown, FormValues>({
    resolver: zodResolver(schema),
  });

  const photoUrl = useWatch({ control, name: "photoUrl" });

  const onSubmit = async (data: FormValues) => {
    setSubmitError(null);
    setSubmitSuccess(null);

    try {
      const user = await createTrader({
        ...data,
        photoUrl: data.photoUrl || undefined,
      });
      setSubmitSuccess(`${user.fullName} cadastrado com sucesso.`);
      reset();
    } catch (error) {
      setSubmitError(getSubmitErrorMessage(error));
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 rounded-3xl bg-gradient-to-b from-[#1A1A40] to-[#0B0B24] p-5 ring-1 ring-white/10 md:gap-5 md:p-8"
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-[auto_1fr] md:gap-5">
        <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-white/10 text-sm text-white/50">
          {photoUrl ? (
            <Image
              src={photoUrl}
              alt="Prévia do trader"
              width={80}
              height={80}
              className="h-full w-full object-cover"
              unoptimized
            />
          ) : (
            "Foto"
          )}
        </div>
        <Field label="Foto" error={errors.photoUrl?.message}>
          <input
            type="text"
            placeholder="https://..."
            className={inputClass}
            {...register("photoUrl")}
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
        <Field label="Nome" error={errors.fullName?.message}>
          <input
            type="text"
            placeholder="Ada Lovelace"
            className={inputClass}
            {...register("fullName")}
          />
        </Field>
        <Field label="E-mail" error={errors.email?.message}>
          <input
            type="email"
            placeholder="ada@email.com"
            className={inputClass}
            {...register("email")}
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
        <Field label="Senha" error={errors.password?.message}>
          <input
            type="password"
            placeholder="••••••••"
            className={inputClass}
            {...register("password")}
          />
        </Field>
        <Field label="Idade" error={errors.age?.message}>
          <input
            type="number"
            placeholder="18"
            className={inputClass}
            {...register("age")}
          />
        </Field>
      </div>

      <div className="mt-2 flex justify-stretch md:justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-gradient-to-r from-violet-500 to-brand-blue-light px-8 py-3 font-display text-sm font-medium text-white shadow-lg transition-opacity hover:opacity-90 disabled:opacity-60 md:w-auto md:text-base"
        >
          {isSubmitting ? "Cadastrando..." : "Cadastrar Trader"}
        </button>
      </div>
      {submitError && <p className="text-sm text-red-400">{submitError}</p>}
      {submitSuccess && (
        <p className="text-sm text-emerald-300">{submitSuccess}</p>
      )}
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className={labelClass}>{label}</span>
      {children}
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}

function getSubmitErrorMessage(error: unknown) {
  if (error instanceof ApiError) {
    return error.message;
  }

  return "Não foi possível cadastrar o trader";
}
