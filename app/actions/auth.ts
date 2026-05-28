'use server'
import { redirect } from 'next/navigation'
import { createSession, deleteSession, decrypt } from '@/app/lib/session'
import { prisma } from '@/app/lib/prisma'
import { jwtDecode } from 'jwt-decode'

export type LoginState = { error: string } | undefined

export async function login(
  _state: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email    = formData.get('email')    as string
  const password = formData.get('password') as string

  const author = await prisma.author.findUnique({ where: { email } })

  if (!author || author.password !== password) {
    return { error: 'Email ou mot de passe incorrect.' }
  }

  const token = await createSession(String(author.id), author.email, author.pseudo, author.role)

  const decoded = jwtDecode(token)
  console.log('[login] token payload décodé :', decoded)

  redirect('/blog')
}

export async function logout() {
  await deleteSession()
  redirect('/login')
}
