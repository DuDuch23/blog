import type { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Accueil',
  description: 'Découvrez des articles sur le développement web, la tech et bien plus encore.',
  openGraph: {
    title: 'Accueil | Mon Blog',
    description: 'Découvrez des articles sur le développement web, la tech et bien plus encore.',
    url: '/',
    type: 'website',
  },
};
import Search from '@/components/Search';
import Table from '@/components/Table';
import Pagination from '@/components/Pagination';
import PostsSkeleton from '@/components/PostsSkeleton';
import { fetchPostsPages } from '@/app/lib/data';

export default async function Home(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;
  const totalPages = await fetchPostsPages(query);

  return (
    <div className="w-full max-w-[1280px] mx-auto px-6 py-16">
      <div className="flex flex-col gap-6">
        <h1 className="text-4xl font-bold text-gray-900">
          Bienvenue sur Mon Blog
        </h1>
        <p className="text-lg text-gray-600 leading-relaxed">
          Découvrez des articles sur le développement web, la tech et bien plus encore.
        </p>

        <Search placeholder="Rechercher un article par son titre ou par auteur..." />

        <Suspense key={query + currentPage} fallback={<PostsSkeleton />}>
          <Table query={query} currentPage={currentPage} />
        </Suspense>

        <Pagination totalPages={totalPages} />

        <div className="flex gap-3 mt-4">
          <a
            href="/blog"
            className="inline-flex items-center px-5 py-2.5 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-700 transition-colors"
          >
            Lire le blog
          </a>
          <a
            href="/about"
            className="inline-flex items-center px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:border-gray-900 hover:text-gray-900 transition-colors"
          >
            À propos
          </a>
        </div>
      </div>
    </div>
  );
}
