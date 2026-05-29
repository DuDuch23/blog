import { getSession } from "@/app/lib/session";
import { prisma } from "@/app/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { deletePost } from "@/app/actions/post";

export default async function ProfilPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const author = await prisma.author.findUnique({
    where: { id: Number(session.userId) },
    include: {
      posts: {
        orderBy: { date: "desc" },
        select: { id: true, title: true, date: true, image: true },
      },
    },
  });

  if (!author) redirect("/login");

  return (
    <div className="w-full max-w-[1280px] mx-auto px-6 py-12">
      <div className="max-w-3xl flex flex-col gap-10">

        {/* Identité */}
        <div className="flex items-center gap-6">
          {author.avatar ? (
            <img
              src={author.avatar}
              alt={author.name}
              className="w-20 h-20 rounded-full object-cover border border-gray-200"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center text-2xl font-bold text-gray-400">
              {author.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{author.name}</h1>
            <p className="text-sm text-gray-500 mt-0.5">@{author.pseudo}</p>
            <span className={`mt-1 inline-block text-xs font-medium px-2 py-0.5 rounded-full ${
              author.role === "ADMIN"
                ? "bg-red-100 text-red-700"
                : "bg-blue-100 text-blue-700"
            }`}>
              {author.role === "ADMIN" ? "Admin" : "Blogueur"}
            </span>
          </div>
          <div>
            <Link
              href="/profil/edit"
              className="ml-auto text-sm font-medium px-4 py-2 rounded-lg border border-gray-300 hover:border-gray-900 hover:text-gray-900 transition-colors"
            >
              Modifier mon profil
            </Link>
          </div>
        </div>

        {/* Infos */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Email</span>
            <span className="text-sm text-gray-700">{author.email}</span>
          </div>

          {author.bio && (
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Bio</span>
              <p className="text-sm text-gray-700">{author.bio}</p>
            </div>
          )}

          {author.interests.length > 0 && (
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Centres d'intérêt</span>
              <div className="flex flex-wrap gap-2">
                {author.interests.map((interest) => (
                  <span key={interest} className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Articles publiés */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Articles publiés{" "}
            <span className="text-sm font-normal text-gray-400">({author.posts.length})</span>
          </h2>

          {author.posts.length === 0 ? (
            <p className="text-sm text-gray-400 italic">Aucun article publié pour l'instant.</p>
          ) : (
            <ul className="flex flex-col gap-3">
              {author.posts.map((post) => (
                <li key={post.id}>
                  <div
                    className="flex items-center gap-4 p-3 rounded-lg border border-gray-200 hover:border-gray-400 hover:shadow-sm transition-all"
                  >
                    {post.image && (
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-14 h-14 rounded-md object-cover flex-shrink-0"
                      />
                    )}
                    <div>
                      <p className="text-sm font-medium text-gray-900">{post.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {new Date(post.date).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <Link
                      href={`/blog/${post.id}`}
                      className="ml-auto text-sm font-medium px-3 py-1 rounded-lg border border-gray-300 hover:border-gray-900 hover:text-gray-900 transition-colors"
                    >
                      Voir
                    </Link>
                    <Link
                      href={`/blog/edit/${post.id}`}
                      className="ml-auto text-sm font-medium px-3 py-1 rounded-lg border border-gray-300 hover:border-gray-900 hover:text-gray-900 transition-colors"
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
                </li>
              ))}
            </ul>
          )}
        </div>

      </div>
    </div>
  );
}
