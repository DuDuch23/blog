export default function Home() {
  return (
    <div className="w-full max-w-[1280px] mx-auto px-6 py-16">
      <div className="flex flex-col gap-6 max-w-xl">
        <h1 className="text-4xl font-bold text-gray-900">
          Bienvenue sur Mon Blog
        </h1>
        <p className="text-lg text-gray-600 leading-relaxed">
          Découvrez des articles sur le développement web, la tech et bien plus encore.
        </p>
        <div className="flex gap-3">
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
