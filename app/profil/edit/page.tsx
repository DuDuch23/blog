import { getSession } from "@/app/lib/session";
import { prisma } from "@/app/lib/prisma";
import { redirect } from "next/navigation";
import ProfileForm from "@/components/ProfileForm";

export default async function EditProfilPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const author = await prisma.author.findUnique({
    where: { id: Number(session.userId) },
    select: { name: true, bio: true, avatar: true, interests: true, pseudo: true, email: true },
  });

  if (!author) redirect("/login");

  return (
    <div className="w-full max-w-[1280px] mx-auto px-6 py-12">
      <div className="max-w-xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Modifier mon profil</h1>
        <ProfileForm author={author} />
      </div>
    </div>
  );
}
