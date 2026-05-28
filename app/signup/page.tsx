"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signUp } from "@/app/lib/auth-client";

export default function SignUpPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: { preventDefault(): void; currentTarget: HTMLFormElement }) {
    e.preventDefault();
    setError(null);
    setPending(true);

    const formData = new FormData(e.currentTarget);

    const res = await signUp.email({
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      pseudo: formData.get("pseudo") as string,
    });

    if (res.error) {
      setError(res.error.message ?? "Une erreur est survenue.");
      setPending(false);
    } else {
      router.push("/blog");
    }
  }

  return (
    <div className="flex flex-1 items-center justify-center bg-zinc-50">
      <div className="w-full max-w-sm rounded-lg bg-white p-8 shadow">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">Inscription</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="name" className="text-sm font-medium text-gray-700">Nom complet</label>
            <input id="name" name="name" type="text" required placeholder="Jean Dupont"
              className="rounded border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-800" />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="pseudo" className="text-sm font-medium text-gray-700">Pseudo</label>
            <input id="pseudo" name="pseudo" type="text" required placeholder="jean_dupont"
              className="rounded border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-800" />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
            <input id="email" name="email" type="email" required placeholder="jean@example.com"
              className="rounded border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-800" />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="text-sm font-medium text-gray-700">Mot de passe</label>
            <input id="password" name="password" type="password" required minLength={8}
              className="rounded border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-800" />
          </div>

          {error && <p className="rounded bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

          <button type="submit" disabled={pending}
            className="mt-2 rounded bg-gray-800 py-2 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-50 transition-colors">
            {pending ? "Création…" : "Créer un compte"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-500">
          Déjà un compte ?{" "}
          <Link href="/login" className="font-medium text-gray-900 hover:underline">Se connecter</Link>
        </p>
      </div>
    </div>
  );
}
