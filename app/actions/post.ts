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
  revalidatePath(`/blog/${post.id}`)
  redirect(`/blog/${post.id}`)
}

export async function editPost(data: {
  id: number
  title: string
  wysiwygContent: string
  image: string
}) {
  const session = await getSession()
  if (!session) redirect('/login')

  const existing = await prisma.post.findUnique({
    where: { id: data.id },
    select: { authorId: true },
  })
  if (!existing) redirect('/blog')
  if (existing.authorId !== Number(session.userId) && session.role !== 'ADMIN') {
    redirect('/blog')
  }

  const post = await prisma.post.update({
    where: {
      id: data.id
    },
    data: {
      title: data.title,
      wysiwygContent: data.wysiwygContent,
      image: data.image,
    },
  })

  revalidatePath('/blog')
  revalidatePath(`/blog/${post.id}`)
  redirect(`/blog/${post.id}`)
}

export async function deletePost(id: number) {
  const session = await getSession()
  if (!session) redirect('/login')

  const existing = await prisma.post.findUnique({
    where: { id },
    select: { authorId: true },
  })
  if (!existing) redirect('/blog')
  if (existing.authorId !== Number(session.userId) && session.role !== 'ADMIN') {
    redirect('/blog')
  }

  await prisma.post.delete({
    where: { id }
  })

  revalidatePath('/blog')
  redirect('/blog')
}