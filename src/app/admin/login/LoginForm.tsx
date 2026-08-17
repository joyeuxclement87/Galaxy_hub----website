"use client";

import { useActionState } from "react";
import { signIn } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle } from "lucide-react";

export function LoginForm() {
  const [state, formAction, pending] = useActionState(
    async (_prev: { error?: string } | null, formData: FormData) => {
      return signIn(formData);
    },
    null
  );

  return (
    <form action={formAction} className="space-y-5">
      {state?.error && (
        <div className="flex items-start gap-2.5 rounded-xl border border-red-100 bg-red-50 dark:bg-red-500/15 px-4 py-3 text-sm text-red-700 dark:text-red-300">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{state.error}</span>
        </div>
      )}

      <div className="space-y-1.5">
        <label
          htmlFor="email"
          className="text-xs font-semibold uppercase tracking-wider text-gray-500"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="admin@galaxyhub.rw"
          className="block w-full rounded-xl border border-gray-200 bg-white dark:bg-[#0f2438] px-4 py-3 text-sm text-[#10233D] placeholder-gray-300 transition-colors focus:border-ocean/40 focus:outline-none focus:ring-2 focus:ring-ocean/10"
        />
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="password"
          className="text-xs font-semibold uppercase tracking-wider text-gray-500"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          placeholder="Enter your password"
          className="block w-full rounded-xl border border-gray-200 bg-white dark:bg-[#0f2438] px-4 py-3 text-sm text-[#10233D] placeholder-gray-300 transition-colors focus:border-ocean/40 focus:outline-none focus:ring-2 focus:ring-ocean/10"
        />
      </div>

      <Button
        type="submit"
        variant="primary"
        disabled={pending}
        className="w-full justify-center"
      >
        {pending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Signing in…
          </>
        ) : (
          "Sign In"
        )}
      </Button>
    </form>
  );
}
