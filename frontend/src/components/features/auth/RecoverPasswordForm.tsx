"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Mail } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FormField } from "./FormField";
import { OtpInput } from "./OtpInput";

const emailSchema = z.object({
  email: z.string().email("E-mail inválido"),
});

const resetSchema = z
  .object({
    password: z.string().min(6, "Mínimo 6 caracteres"),
    confirm: z.string().min(1, "Confirme a senha"),
  })
  .refine((d) => d.password === d.confirm, {
    message: "As senhas não coincidem",
    path: ["confirm"],
  });

type EmailValues = z.infer<typeof emailSchema>;
type ResetValues = z.infer<typeof resetSchema>;

export function RecoverPasswordForm() {
  const [step, setStep] = useState<1 | 2>(1);
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState<string | null>(null);

  const emailForm = useForm<EmailValues>({ resolver: zodResolver(emailSchema) });
  const resetForm = useForm<ResetValues>({ resolver: zodResolver(resetSchema) });

  const onSendCode = async (data: EmailValues) => {
    // TODO integrar com POST /api/v1/auth/forgot-password
    console.log("send code", data);
    await new Promise((r) => setTimeout(r, 400));
    setStep(2);
  };

  const onResetPassword = async (data: ResetValues) => {
    if (code.length !== 4) {
      setCodeError("Informe o código de 4 dígitos");
      return;
    }
    setCodeError(null);
    // TODO integrar com POST /api/v1/auth/reset-password
    console.log("reset", { code, ...data });
    await new Promise((r) => setTimeout(r, 400));
  };

  if (step === 1) {
    return (
      <form
        onSubmit={emailForm.handleSubmit(onSendCode)}
        className="flex flex-1 flex-col gap-4 md:gap-5"
      >
        <p className="text-sm text-zinc-500 md:text-base">
          Digite o e-mail associado à sua conta. Enviaremos um código de
          verificação para você redefinir sua senha.
        </p>
        <FormField
          label="E-mail"
          type="email"
          placeholder="exemplo@email.com"
          icon={<Mail className="h-4 w-4" />}
          error={emailForm.formState.errors.email?.message}
          {...emailForm.register("email")}
        />
        <button
          type="submit"
          disabled={emailForm.formState.isSubmitting}
          className="mt-auto w-full rounded-xl bg-brand-blue-light px-6 py-3 font-display text-base font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60 md:mt-3 md:py-3.5 md:text-lg"
        >
          {emailForm.formState.isSubmitting ? "Enviando..." : "Enviar Código"}
        </button>
      </form>
    );
  }

  return (
    <form
      onSubmit={resetForm.handleSubmit(onResetPassword)}
      className="flex flex-1 flex-col gap-4 md:gap-5"
    >
      <p className="text-sm text-zinc-500 md:text-base">
        Digite o código de verificação que enviamos para o seu e-mail.
      </p>
      <div className="flex flex-col gap-1">
        <OtpInput value={code} onChange={setCode} />
        {codeError && <p className="mt-1 text-xs text-red-500">{codeError}</p>}
      </div>
      <FormField
        label="Nova Senha"
        type="password"
        placeholder="••••••••"
        icon={<Lock className="h-4 w-4" />}
        error={resetForm.formState.errors.password?.message}
        {...resetForm.register("password")}
      />
      <FormField
        label="Digite a Nova Senha Novamente"
        type="password"
        placeholder="••••••••"
        icon={<Lock className="h-4 w-4" />}
        error={resetForm.formState.errors.confirm?.message}
        {...resetForm.register("confirm")}
      />
      <button
        type="submit"
        disabled={resetForm.formState.isSubmitting}
        className="mt-auto w-full rounded-xl bg-brand-blue-light px-6 py-3 font-display text-base font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60 md:mt-3 md:py-3.5 md:text-lg"
      >
        {resetForm.formState.isSubmitting ? "Mudando..." : "Mudar senha"}
      </button>
    </form>
  );
}
