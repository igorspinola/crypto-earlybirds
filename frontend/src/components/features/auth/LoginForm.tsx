"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Mail } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FormField } from "./FormField";

const schema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(1, "Senha é obrigatória"),
});

type FormValues = z.infer<typeof schema>;

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormValues) => {
    // TODO integrar com POST /api/v1/auth/login quando endpoint estiver pronto
    console.log("submit", data);
    await new Promise((r) => setTimeout(r, 400));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
      <FormField
        label="E-mail"
        type="email"
        placeholder="exemplo@email.com"
        icon={<Mail className="h-4 w-4" />}
        error={errors.email?.message}
        {...register("email")}
      />
      <div className="flex flex-col gap-1">
        <FormField
          label="Senha"
          type="password"
          placeholder="••••••••"
          icon={<Lock className="h-4 w-4" />}
          error={errors.password?.message}
          {...register("password")}
        />
        <Link
          href="/recuperar-senha"
          className="self-end text-xs font-medium text-brand-blue-light hover:underline md:text-sm"
        >
          Esqueci minha senha
        </Link>
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-3 w-full rounded-xl bg-brand-blue-light px-6 py-3 font-display text-base font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60 md:py-3.5 md:text-lg"
      >
        {isSubmitting ? "Entrando..." : "Entrar"}
      </button>
      <p className="mt-1 text-center text-xs text-zinc-500 md:text-sm">
        Não tem uma conta?{" "}
        <Link
          href="/cadastrar"
          className="font-medium text-brand-blue-light hover:underline"
        >
          Cadastre-se!
        </Link>
      </p>
    </form>
  );
}
