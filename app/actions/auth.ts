'use server'
import { createSession, deleteSession } from '@/app/lib/session'
import { prisma } from '@/app/lib/prisma'

export type LoginState = { error: string } | { success: true } | undefined

export async function login(
  _state: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email    = formData.get('email')    as string
  const password = formData.get('password') as string

  let author
  try {
    author = await prisma.author.findUnique({ where: { email } })
  } catch {
    return { error: 'Impossible de joindre la base de données.' }
  }

  if (!author || author.password !== password) {
    return { error: 'Email ou mot de passe incorrect.' }
  }

  await createSession(String(author.id), author.email, author.pseudo, author.role)

  return { success: true }
}

export async function logout() {
  await deleteSession()
}
