"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ApiError, resetPassword } from "@/lib/api";
import { FormField } from "./FormField";

const schema = z
  .object({
    password: z.string().min(6, "Mínimo 6 caracteres"),
    confirm: z.string().min(1, "Confirme a senha"),
  })
  .refine((d) => d.password === d.confirm, {
    message: "As senhas não coincidem",
    path: ["confirm"],
  });

type FormValues = z.infer<typeof schema>;

type ResetPasswordFormProps = {
  token: string;
};

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<FormValues>({ resolver: zodResolver(schema) });

  if (!token) {
    return (
      <p className="text-sm text-red-500">
        Link inválido ou expirado. Solicite um novo em{" "}
        <a href="/recuperar-senha" className="underline">
          recuperar senha
        </a>
        .
      </p>
    );
  }

  if (submitted) {
    return (
      <div className="flex flex-1 flex-col gap-4 md:gap-5">
        <p className="text-sm text-zinc-500 md:text-base">
          Senha redefinida com sucesso. Você será redirecionado para o login.
        </p>
      </div>
    );
  }

  const onSubmit = async (data: FormValues) => {
    setSubmitError(null);
    try {
      await resetPassword(token, data.password);
      setSubmitted(true);
      setTimeout(() => router.replace("/login"), 1500);
    } catch (error) {
      setSubmitError(
        error instanceof ApiError
          ? error.message
          : "Não foi possível redefinir a senha",
      );
    }
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-1 flex-col gap-4 md:gap-5"
    >
      <p className="text-sm text-zinc-500 md:text-base">
        Defina uma nova senha para a sua conta.
      </p>
      <FormField
        label="Nova Senha"
        type="password"
        placeholder="••••••••"
        icon={<Lock className="h-4 w-4" />}
        error={form.formState.errors.password?.message}
        {...form.register("password")}
      />
      <FormField
        label="Digite a Nova Senha Novamente"
        type="password"
        placeholder="••••••••"
        icon={<Lock className="h-4 w-4" />}
        error={form.formState.errors.confirm?.message}
        {...form.register("confirm")}
      />
      {submitError && <p className="text-xs text-red-500">{submitError}</p>}
      <button
        type="submit"
        disabled={form.formState.isSubmitting}
        className="mt-auto w-full rounded-xl bg-brand-blue-light px-6 py-3 font-display text-base font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60 md:mt-3 md:py-3.5 md:text-lg"
      >
        {form.formState.isSubmitting ? "Salvando..." : "Mudar senha"}
      </button>
    </form>
  );
}
