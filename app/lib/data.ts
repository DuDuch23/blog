import { prisma } from './prisma';

const POSTS_PER_PAGE = 6;

export async function fetchFilteredPosts(query: string, currentPage: number) {
  const offset = (currentPage - 1) * POSTS_PER_PAGE;
  return prisma.post.findMany({
    where: {
      OR: [
        {
          title: {
            contains: query,
            mode: 'insensitive'
          }
        },
        {
          author: {
            pseudo: {
              contains: query,
              mode: 'insensitive'
            }
          }
        }
      ]
    },
    include: {
      author: {
        select: {
          pseudo: true,
          name: true,
          avatar: true
        }
      }
    },
    orderBy: {
      date: 'desc'
    },
    take: POSTS_PER_PAGE,
    skip: offset,
  });
}

export async function fetchPostsPages(query: string) {
  const count = await prisma.post.count({
    where: {
      OR: [
        {
          title: {
            contains: query,
            mode: 'insensitive'
          }
        },
        {
          author: {
            pseudo: {
              contains: query,
              mode: 'insensitive'
            }
          }
        },
      ],
    },
  });
  return Math.ceil(count / POSTS_PER_PAGE);
}
