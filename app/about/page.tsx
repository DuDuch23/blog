import { getSession } from "@/app/lib/session";
import AboutEditor from "@/app/components/AboutEditor";
import { prisma } from "@/app/lib/prisma";

export default async function AboutPage() {
  const session = await getSession();
  const setting = await prisma.siteSetting.findUnique({ where: { key: "about_content" } });
  const content = setting?.value ?? "";
  const isAdmin = session?.role === "ADMIN";

  return (
    <div className="w-full max-w-[1280px] mx-auto px-6 py-12">
      <div className="max-w-3xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">À propos</h1>

        {isAdmin ? (
          <AboutEditor initialContent={content} />
        ) : content ? (
          <div
            className="text-gray-700 leading-relaxed [&_p]:mb-4 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-gray-900"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        ) : (
          <p className="text-gray-400 italic">Aucun contenu pour le moment.</p>
        )}
      </div>
    </div>
  );
}
