"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Mail } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ApiError, requestPasswordReset } from "@/lib/api";
import { FormField } from "./FormField";

const schema = z.object({
  email: z.string().email("E-mail inválido"),
});

type FormValues = z.infer<typeof schema>;

export function RecoverPasswordForm() {
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormValues) => {
    setSubmitError(null);
    try {
      await requestPasswordReset(data.email);
      setSubmitted(true);
    } catch (error) {
      setSubmitError(
        error instanceof ApiError
          ? error.message
          : "Não foi possível enviar o e-mail",
      );
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-1 flex-col gap-4 md:gap-5">
        <p className="text-sm text-zinc-500 md:text-base">
          Se o e-mail estiver cadastrado, você receberá um link em instantes
          para redefinir sua senha. Verifique sua caixa de entrada (e o spam).
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-1 flex-col gap-4 md:gap-5"
    >
      <p className="text-sm text-zinc-500 md:text-base">
        Digite o e-mail associado à sua conta. Enviaremos um link para você
        redefinir sua senha.
      </p>
      <FormField
        label="E-mail"
        type="email"
        placeholder="exemplo@email.com"
        icon={<Mail className="h-4 w-4" />}
        error={form.formState.errors.email?.message}
        {...form.register("email")}
      />
      {submitError && <p className="text-xs text-red-500">{submitError}</p>}
      <button
        type="submit"
        disabled={form.formState.isSubmitting}
        className="mt-auto w-full rounded-xl bg-brand-blue-light px-6 py-3 font-display text-base font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60 md:mt-3 md:py-3.5 md:text-lg"
      >
        {form.formState.isSubmitting ? "Enviando..." : "Enviar Link"}
      </button>
    </form>
  );
}
