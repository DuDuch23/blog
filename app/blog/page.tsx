import Link from 'next/link';
import { prisma } from '@/app/lib/prisma';

export const revalidate = false;

export default async function BlogPage() {
  const posts = await prisma.post.findMany({
    include: { author: { select: { name: true, pseudo: true } } },
    orderBy: { date: 'desc' },
  });

  return (
    <div className="w-full max-w-[1280px] mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Blog</h1>
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <li key={post.id}>
            <Link href={`/blog/${post.id}`} className="block group rounded-xl border border-gray-200 overflow-hidden hover:border-gray-400 hover:shadow-sm transition-all">
              {post.image && (
                <img src={post.image} alt={post.title} className="w-full h-44 object-cover" />
              )}
              <div className="p-4">
                <p className="text-base font-semibold text-gray-900 group-hover:text-gray-600 transition-colors">{post.title}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {post.author?.name} · {new Date(post.date).toLocaleDateString("fr-FR")}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
