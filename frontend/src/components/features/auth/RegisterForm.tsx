"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Mail, User } from "lucide-react";
import Image from "next/image";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { FormField } from "./FormField";

const schema = z.object({
  fullName: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
  photoUrl: z.string().url("URL inválida").optional().or(z.literal("")),
  age: z.coerce
    .number()
    .int("Idade deve ser um número inteiro")
    .min(13, "Mínimo 13 anos")
    .max(120, "Idade inválida")
    .optional(),
});

type FormValues = z.infer<typeof schema>;
type FormInput = z.input<typeof schema>;

export function RegisterForm() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormInput, unknown, FormValues>({
    resolver: zodResolver(schema),
  });

  const photoUrl = useWatch({ control, name: "photoUrl" });

  const onSubmit = async (data: FormValues) => {
    // TODO integrar com POST /api/v1/auth/register quando endpoint estiver pronto
    console.log("submit", data);
    await new Promise((r) => setTimeout(r, 400));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
      <FormField
        label="Nome"
        placeholder="Fulano"
        icon={<User className="h-4 w-4" />}
        error={errors.fullName?.message}
        {...register("fullName")}
      />
      <FormField
        label="E-mail"
        type="email"
        placeholder="exemplo@email.com"
        icon={<Mail className="h-4 w-4" />}
        error={errors.email?.message}
        {...register("email")}
      />
      <FormField
        label="Senha"
        type="password"
        placeholder="••••••••"
        icon={<Lock className="h-4 w-4" />}
        error={errors.password?.message}
        {...register("password")}
      />
      <div className="grid grid-cols-[auto_1fr_auto] items-start gap-2">
        <div className="mt-1 flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-zinc-200 md:h-14 md:w-14">
          {photoUrl ? (
            <Image
              src={photoUrl}
              alt="Prévia da foto"
              width={56}
              height={56}
              className="h-full w-full object-cover"
              unoptimized
            />
          ) : (
            <User className="h-5 w-5 text-zinc-400 md:h-6 md:w-6" />
          )}
        </div>
        <FormField
          label="Foto"
          placeholder="url.com"
          error={errors.photoUrl?.message}
          {...register("photoUrl")}
        />
        <FormField
          label="Idade"
          type="number"
          placeholder="18"
          className="w-20 md:w-24"
          error={errors.age?.message}
          {...register("age")}
        />
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-3 w-full rounded-xl bg-brand-blue-light px-6 py-3 font-display text-base font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60 md:py-3.5 md:text-lg"
      >
        {isSubmitting ? "Criando conta..." : "Criar Conta"}
      </button>
    </form>
  );
}
