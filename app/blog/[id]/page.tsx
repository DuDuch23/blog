import { prisma } from "@/app/lib/prisma";
import { notFound } from "next/navigation";

export default async function SinglePostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const post = await prisma.post.findUnique({
    where: { id: Number(id) },
    include: { author: true },
  });

  if (!post) notFound();

  return (
    <div className="w-full max-w-[1280px] mx-auto px-6 py-12">
      <div className="max-w-3xl">
        <p className="text-sm text-gray-500 mb-3">
          Par <span className="font-medium text-gray-700">{post.author.name}</span>
          {" · "}
          {new Date(post.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
        </p>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">{post.title}</h1>

        {post.image && (
          <img src={post.image} alt={post.title} className="w-full rounded-xl mb-8 object-cover max-h-80" />
        )}

        <div
          className="text-gray-700 leading-relaxed [&_p]:mb-4 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-gray-900 [&_h2]:mt-6 [&_h2]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_a]:text-blue-600 [&_a]:underline"
          dangerouslySetInnerHTML={{ __html: post.wysiwygContent }}
        />
      </div>
    </div>
  );
}
