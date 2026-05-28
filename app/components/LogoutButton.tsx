"use client";

import { signOut } from "@/app/lib/auth-client";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  return (
    <button
      onClick={async () => {
        await signOut();
        router.push("/login");
        router.refresh();
      }}
      className="text-sm font-medium px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:border-red-500 hover:text-red-600 transition-colors"
    >
      Déconnexion
    </button>
  );
}
