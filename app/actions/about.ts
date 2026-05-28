'use server'

import { revalidatePath } from 'next/cache'
import { getSession } from '@/app/lib/session'
import { prisma } from '@/app/lib/prisma'

export async function saveAbout(content: string) {
  const session = await getSession()
  if (!session || session.role !== 'ADMIN') throw new Error('Non autorisé')

  await prisma.siteSetting.upsert({
    where: {
      key: 'about_content'
    },
    update: {
      value: content
    },
    create: {
      key: 'about_content',
      value: content
    },
  })

  revalidatePath('/about')
}
