'use server'

import { prisma } from '@/app/lib/prisma'
import { getSession } from '@/app/lib/session'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createPost(data: {
  title: string
  wysiwygContent: string
  image: string
}) {
  const session = await getSession()

  if (!session) redirect('/login')

  const post = await prisma.post.create({
    data: {
      title: data.title,
      wysiwygContent: data.wysiwygContent,
      image: data.image,
      authorId: Number(session.userId),
    },
  })

  revalidatePath('/blog')
  redirect(`/blog/${post.id}`)
}
