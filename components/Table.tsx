import { fetchFilteredPosts } from '@/app/lib/data';
import Link from 'next/link';

export default async function Table({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const posts = await fetchFilteredPosts(query, currentPage);

  if (posts.length === 0) {
    return (
      <p className="mt-6 text-sm text-gray-500">
        Aucun article trouvé{query ? ` pour « ${query} »` : ''}.
      </p>
    );
  }

  return (
    <div className="mt-6 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {posts.map((post) => (
        <Link
          key={post.id}
          href={`/blog/${post.id}`}
          className="group flex flex-col gap-2 rounded-xl border border-gray-200 p-5 hover:border-gray-400 hover:shadow-sm transition-all"
        >
          {post.image && (
            <img
              src={post.image}
              alt={post.title}
              className="h-40 w-full rounded-lg object-cover"
            />
          )}
          <h2 className="text-base font-semibold text-gray-900 group-hover:text-blue-600 line-clamp-2">
            {post.title}
          </h2>
          <p className="text-xs text-gray-500">
            Par {post.author.name || post.author.pseudo} ·{' '}
            {new Date(post.date).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>
        </Link>
      ))}
    </div>
  );
}
