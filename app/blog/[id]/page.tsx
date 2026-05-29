import { prisma } from "@/app/lib/prisma";
import { getSession } from "@/app/lib/session";
import { notFound } from "next/navigation";
import Link from "next/link";
import parse from "html-react-parser";
import type { Metadata } from "next";
import { deletePost } from "@/app/actions/post";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;

  const post = await prisma.post.findUnique({
    where: {
      id: Number(id)
    },
    include: {
      author: true
    },
  });

  if (!post) notFound();

  const description = post.wysiwygContent.replace(/<[^>]+>/g, '').slice(0, 160);

  return {
    title: post.title,
    description,
    openGraph: {
      title: post.title,
      description,
      url: `/blog/${post.id}`,
      type: 'article',
      images: post.image ? [post.image] : [],
      publishedTime: post.date.toISOString(),
      modifiedTime: post.date.toISOString(),
      authors: [post.author.name],
    },
  };
}

export default async function SinglePostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [post, session] = await Promise.all([
    prisma.post.findUnique({
      where: { id: Number(id) },
      include: { author: true },
    }),
    getSession(),
  ]);

  if (!post) notFound();

  const canEdit =
    session &&
    (session.userId === String(post.authorId) || session.role === "ADMIN");

  return (
    <div className="w-full max-w-[1280px] mx-auto px-6 py-12">
      <div className="max-w-3xl">
        <div className="flex items-start justify-between mb-6 gap-4">
          <div>
            <p className="text-sm text-gray-500 mb-3">
              Par <span className="font-medium text-gray-700">{post.author.name}</span>
              {" · "}
              {new Date(post.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
            </p>
            <h1 className="text-3xl font-bold text-gray-900">{post.title}</h1>
          </div>

          {canEdit && (
            <div className="flex gap-2 flex-shrink-0">
              <Link
                href={`/blog/edit/${post.id}`}
                className="text-sm font-medium px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:border-gray-900 hover:text-gray-900 transition-colors"
              >
                Modifier
              </Link>
              <form action={deletePost.bind(null, post.id)}>
                <button
                  type="submit"
                  className="text-sm font-medium px-4 py-2 rounded-lg border border-red-200 text-red-600 hover:border-red-500 hover:bg-red-50 transition-colors"
                >
                  Supprimer
                </button>
              </form>
            </div>
          )}
        </div>

        {post.image && (
          <img src={post.image} alt={post.title} className="w-full rounded-xl mb-8 object-cover max-h-80" />
        )}

        <div className="text-gray-700 leading-relaxed [&_p]:mb-4 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-gray-900 [&_h2]:mt-6 [&_h2]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_a]:text-blue-600 [&_a]:underline">
          {parse(post.wysiwygContent)}
        </div>
      </div>
    </div>
  );
}
