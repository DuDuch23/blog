"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { login } from "@/app/actions/auth";

export default function LoginPage() {
  const router = useRouter();
  const [state, action, pending] = useActionState(login, undefined);

  useEffect(() => {
    if (state && 'success' in state) {
      router.push("/blog");
    }
  }, [state, router]);

  return (
    <div className="flex flex-1 items-center justify-center bg-zinc-50">
      <div className="w-full max-w-sm rounded-lg bg-white p-8 shadow">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">Connexion</h1>

        <form action={action} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
            <input id="email" name="email" type="email" required placeholder="jean@example.com"
              className="rounded border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-800" />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="text-sm font-medium text-gray-700">Mot de passe</label>
            <input id="password" name="password" type="password" required
              className="rounded border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-800" />
          </div>

          {state && 'error' in state && (
            <p className="rounded bg-red-50 px-3 py-2 text-sm text-red-600">{state.error}</p>
          )}

          <button type="submit" disabled={pending}
            className="mt-2 rounded bg-gray-800 py-2 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-50 transition-colors">
            {pending ? "Connexion…" : "Se connecter"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-500">
          Pas encore de compte ?{" "}
          <Link href="/signup" className="font-medium text-gray-900 hover:underline">S'inscrire</Link>
        </p>
      </div>
    </div>
  );
}
