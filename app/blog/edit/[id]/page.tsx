import { getSession } from "@/app/lib/session";
import { prisma } from "@/app/lib/prisma";
import { redirect, notFound } from "next/navigation";
import EditPostForm from "@/components/EditPostForm";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getSession();
  if (!session) redirect("/login");

  const post = await prisma.post.findUnique({
    where: { id: Number(id) },
    select: { id: true, title: true, wysiwygContent: true, image: true, authorId: true },
  });

  if (!post) notFound();

  if (post.authorId !== Number(session.userId) && session.role !== "ADMIN") {
    redirect("/blog");
  }

  return (
    <div className="w-full max-w-[1280px] mx-auto px-6 py-12">
      <div className="max-w-3xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Modifier l'article</h1>
        <EditPostForm post={post} />
      </div>
    </div>
  );
}
