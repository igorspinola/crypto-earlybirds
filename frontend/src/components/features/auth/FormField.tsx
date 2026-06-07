import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";

type FormFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  icon?: ReactNode;
  label: string;
  error?: string;
};

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  function FormField({ icon, label, error, className, id, ...props }, ref) {
    const inputId = id ?? props.name;
    return (
      <div className={className}>
        <div
          className={`flex items-center gap-3 rounded-xl border bg-white px-3 py-2 transition-colors focus-within:border-brand-blue-light md:px-4 md:py-2.5 ${
            error ? "border-red-500" : "border-zinc-300"
          }`}
        >
          {icon && (
            <span className="flex h-5 w-5 shrink-0 items-center justify-center text-zinc-500">
              {icon}
            </span>
          )}
          <div className="flex min-w-0 flex-1 flex-col leading-tight">
            <label
              htmlFor={inputId}
              className="text-[10px] font-medium uppercase tracking-wide text-zinc-500 md:text-[11px]"
            >
              {label}
            </label>
            <input
              ref={ref}
              id={inputId}
              {...props}
              className="border-none bg-transparent p-0 text-sm text-foreground outline-none placeholder:text-zinc-400 md:text-base"
            />
          </div>
        </div>
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
    );
  },
);
