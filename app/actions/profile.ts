'use server'

import { revalidatePath } from 'next/cache'
import { getSession } from '@/app/lib/session'
import { prisma } from '@/app/lib/prisma'

export type ProfileState = { error: string } | { success: true } | undefined

export async function updateProfile(
  _state: ProfileState,
  formData: FormData
): Promise<ProfileState> {
  const session = await getSession()
  if (!session) return { error: 'Non autorisé.' }

  const name = (formData.get('name') as string)?.trim()
  const bio = (formData.get('bio') as string)?.trim()
  const avatar = (formData.get('avatar') as string)?.trim()
  const interestsRaw = (formData.get('interests') as string)?.trim()

  if (!name) return { error: 'Le nom est requis.' }

  const interests = interestsRaw
    ? interestsRaw.split(',').map((s) => s.trim()).filter(Boolean)
    : []

  try {
    await prisma.author.update({
      where: { id: Number(session.userId) },
      data: { name, bio, avatar, interests },
    })
  } catch {
    return { error: 'Erreur lors de la mise à jour.' }
  }

  revalidatePath('/profil')
  return { success: true }
}
