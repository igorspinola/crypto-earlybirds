"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ApiError, createCryptocurrency } from "@/lib/api";
import type { CmsCategory } from "@/lib/prismic";

const schema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  categoryUid: z.string().min(1, "Selecione uma categoria"),
  symbol: z
    .string()
    .min(2, "Mínimo 2 caracteres")
    .max(10, "Máximo 10 caracteres")
    .regex(/^[A-Za-z0-9]+$/, "Apenas letras e números"),
  initialPrice: z.coerce.number().positive("Maior que zero"),
  quantity: z.coerce.number().positive("Maior que zero"),
  imageUrl: z.string().url("URL inválida"),
  description: z.string().min(1, "Detalhes são obrigatórios"),
});

type FormValues = z.infer<typeof schema>;
type FormInput = z.input<typeof schema>;

type Props = {
  categories: CmsCategory[];
};

const inputClass =
  "w-full rounded-xl border border-white/10 bg-[#0E0E2E]/80 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/30 focus:border-brand-blue-light md:text-base";

const labelClass = "text-sm font-medium text-white";

export function CryptoCreateForm({ categories }: Props) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormInput, unknown, FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormValues) => {
    setSubmitError(null);
    setSubmitSuccess(null);

    try {
      const cryptocurrency = await createCryptocurrency(data);
      setSubmitSuccess(`${cryptocurrency.symbol} cadastrada com sucesso.`);
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
      <Field label="Nome da Moeda" error={errors.name?.message}>
        <input
          type="text"
          placeholder="Solana"
          className={inputClass}
          {...register("name")}
        />
      </Field>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
        <Field label="Categoria" error={errors.categoryUid?.message}>
          <select
            className={`${inputClass} appearance-none bg-[url('data:image/svg+xml;utf8,<svg fill=%22white%22 height=%2212%22 viewBox=%220 0 20 20%22 xmlns=%22http://www.w3.org/2000/svg%22><path d=%22M5.5 7.5l4.5 4.5 4.5-4.5z%22/></svg>')] bg-[length:14px] bg-[position:right_1rem_center] bg-no-repeat pr-10`}
            defaultValue=""
            {...register("categoryUid")}
          >
            <option value="" disabled className="text-zinc-500">
              Selecione
            </option>
            {categories.map((cat) => (
              <option key={cat.uid} value={cat.uid} className="text-zinc-900">
                {cat.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Símbolo" error={errors.symbol?.message}>
          <input
            type="text"
            placeholder="SOL"
            className={inputClass}
            {...register("symbol")}
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
        <Field label="Preço Inicial" error={errors.initialPrice?.message}>
          <input
            type="number"
            step="any"
            placeholder="R$ 1000,00"
            className={inputClass}
            {...register("initialPrice")}
          />
        </Field>
        <Field label="Quantidade" error={errors.quantity?.message}>
          <input
            type="number"
            step="any"
            placeholder="200"
            className={inputClass}
            {...register("quantity")}
          />
        </Field>
        <Field label="Url" error={errors.imageUrl?.message}>
          <input
            type="text"
            placeholder="url.com"
            className={inputClass}
            {...register("imageUrl")}
          />
        </Field>
      </div>

      <Field label="Detalhes" error={errors.description?.message}>
        <textarea
          rows={3}
          placeholder="Descrição da moeda..."
          className={`${inputClass} min-h-24 resize-y`}
          {...register("description")}
        />
      </Field>

      <div className="mt-2 flex justify-stretch md:justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-gradient-to-r from-violet-500 to-brand-blue-light px-8 py-3 font-display text-sm font-medium text-white shadow-lg transition-opacity hover:opacity-90 disabled:opacity-60 md:w-auto md:text-base"
        >
          {isSubmitting ? "Cadastrando..." : "Cadastrar Criptomoeda"}
        </button>
      </div>
      {submitError && <p className="text-sm text-red-400">{submitError}</p>}
      {submitSuccess && (
        <p className="text-sm text-emerald-300">{submitSuccess}</p>
      )}
    </form>
  );
}

function getSubmitErrorMessage(error: unknown) {
  if (error instanceof ApiError) {
    return error.message;
  }

  return "Não foi possível cadastrar a criptomoeda";
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
