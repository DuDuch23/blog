import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({
  connectionString: process.env.POSTGRES_URL!
});

const prisma = new PrismaClient({
  adapter
});

async function main() {
  await prisma.post.deleteMany();
  await prisma.author.deleteMany();

  // Admins
  const admin1 = await prisma.author.create({
    data: {
      email: "admin@blog.fr",
      pseudo: "alice_admin",
      password: "admin1234",
      name: "Alice Martin",
      bio: "Administratrice de la plateforme.",
      avatar: "https://i.pravatar.cc/150?u=alice",
      interests: ["Gestion", "Modération"],
      role: "ADMIN",
    },
  });

  const admin2 = await prisma.author.create({
    data: {
      email: "superadmin@blog.fr",
      pseudo: "bruno_su",
      password: "super5678",
      name: "Bruno Lefèvre",
      bio: "Co-fondateur et admin principal.",
      avatar: "https://i.pravatar.cc/150?u=bruno",
      interests: ["Tech", "Stratégie"],
      role: "ADMIN",
    },
  });

  // Blogueurs
  const blogger1 = await prisma.author.create({
    data: {
      email: "claire@blog.fr",
      pseudo: "claire_dev",
      password: "claire1234",
      name: "Claire Dupont",
      bio: "Passionnée de développement web et de design.",
      avatar: "https://i.pravatar.cc/150?u=claire",
      interests: ["React", "CSS", "UX"],
      role: "BLOGGER",
    },
  });

  const blogger2 = await prisma.author.create({
    data: {
      email: "david@blog.fr",
      pseudo: "david_db",
      password: "david1234",
      name: "David Morel",
      bio: "Développeur backend, fan de bases de données.",
      avatar: "https://i.pravatar.cc/150?u=david",
      interests: ["PostgreSQL", "Node.js", "DevOps"],
      role: "BLOGGER",
    },
  });

  const blogger3 = await prisma.author.create({
    data: {
      email: "emma@blog.fr",
      pseudo: "emma_ia",
      password: "emma1234",
      name: "Emma Bernard",
      bio: "Rédactrice tech et vulgarisatrice scientifique.",
      avatar: "https://i.pravatar.cc/150?u=emma",
      interests: ["IA", "Vulgarisation", "Python"],
      role: "BLOGGER",
    },
  });

  // Posts
  await prisma.post.createMany({
    data: [
      {
        title: "Débuter avec Next.js 16",
        wysiwygContent: "<p>Next.js 16 apporte de nombreuses nouveautés comme le support amélioré du streaming et des Server Actions. Voici comment démarrer...</p>",
        image: "https://picsum.photos/seed/nextjs/800/400",
        authorId: blogger1.id,
      },
      {
        title: "Tailwind CSS v4 : ce qui change",
        wysiwygContent: "<p>La version 4 de Tailwind CSS repense complètement la configuration avec un système de thème basé sur les variables CSS natives...</p>",
        image: "https://picsum.photos/seed/tailwind/800/400",
        authorId: blogger1.id,
      },
      {
        title: "PostgreSQL vs MySQL en 2025",
        wysiwygContent: "<p>Comparaison détaillée des deux moteurs de bases de données les plus populaires : performances, fonctionnalités, cas d'usage...</p>",
        image: "https://picsum.photos/seed/postgres/800/400",
        authorId: blogger2.id,
      },
      {
        title: "Prisma ORM v7 : nouveautés",
        wysiwygContent: "<p>Prisma v7 introduit une nouvelle façon de configurer la connexion à la base de données via prisma.config.ts et les driver adapters...</p>",
        image: "https://picsum.photos/seed/prisma/800/400",
        authorId: blogger2.id,
      },
      {
        title: "L'IA générative expliquée simplement",
        wysiwygContent: "<p>Comment fonctionnent réellement les grands modèles de langage ? Une explication accessible sans jargon mathématique...</p>",
        image: "https://picsum.photos/seed/ai/800/400",
        authorId: blogger3.id,
      },
      {
        title: "Annonce : nouvelles règles de modération",
        wysiwygContent: "<p>Afin de maintenir un espace de qualité, nous mettons à jour nos règles de publication. Lisez attentivement avant de poster...</p>",
        image: "https://picsum.photos/seed/admin/800/400",
        authorId: admin1.id,
      },
    ],
  });

  console.log("✓ Seed terminé :");
  console.log(`  2 admins, 3 blogueurs, 6 posts`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
