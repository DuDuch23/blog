"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { updateProfile } from "@/app/actions/profile";

type Props = {
  author: {
    name: string;
    bio: string;
    avatar: string;
    interests: string[];
    pseudo: string;
    email: string;
  };
};

export default function ProfileForm({ author }: Props) {
  const router = useRouter();
  const [state, action, pending] = useActionState(updateProfile, undefined);

  useEffect(() => {
    if (state && "success" in state) {
      router.push("/profil");
    }
  }, [state, router]);

  return (
    <form action={action} className="flex flex-col gap-5">
      {/* Champs non modifiables */}
      <div className="flex flex-col gap-1">
        <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Pseudo</span>
        <span className="text-sm text-gray-500">@{author.pseudo}</span>
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Email</span>
        <span className="text-sm text-gray-500">{author.email}</span>
      </div>

      <hr className="border-gray-200" />

      {/* Nom */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="name" className="text-sm font-medium text-gray-700">
          Nom complet <span className="text-red-500">*</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          defaultValue={author.name}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-800"
        />
      </div>

      {/* Bio */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="bio" className="text-sm font-medium text-gray-700">Bio</label>
        <textarea
          id="bio"
          name="bio"
          rows={3}
          defaultValue={author.bio}
          placeholder="Décrivez-vous en quelques mots…"
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-800 resize-none"
        />
      </div>

      {/* Avatar */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="avatar" className="text-sm font-medium text-gray-700">URL de l'avatar</label>
        <input
          id="avatar"
          name="avatar"
          type="url"
          defaultValue={author.avatar}
          placeholder="https://…"
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-800"
        />
        {author.avatar && (
          <img
            src={author.avatar}
            alt="Aperçu"
            className="mt-1 w-14 h-14 rounded-full object-cover border border-gray-200"
          />
        )}
      </div>

      {/* Centres d'intérêt */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="interests" className="text-sm font-medium text-gray-700">
          Centres d'intérêt
        </label>
        <input
          id="interests"
          name="interests"
          type="text"
          defaultValue={author.interests.join(", ")}
          placeholder="React, Next.js, Design…"
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-800"
        />
        <p className="text-xs text-gray-400">Séparés par des virgules.</p>
      </div>

      {state && "error" in state && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{state.error}</p>
      )}

      <div className="flex gap-3 pt-1">
        <button
          type="submit"
          disabled={pending}
          className="px-5 py-2 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-700 disabled:opacity-50 transition-colors"
        >
          {pending ? "Enregistrement…" : "Enregistrer"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:border-gray-900 hover:text-gray-900 transition-colors"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}
