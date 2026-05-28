import 'server-only'
import { cookies } from 'next/headers'
import { jwtDecode } from 'jwt-decode'

const SECRET = process.env.SESSION_SECRET ?? 'dev-secret-change-in-production'

export type Role = 'ADMIN' | 'BLOGGER'

export type SessionData = {
  userId: string
  email: string
  pseudo: string
  role: Role
  expiresAt: number
}

// Signe "header.payload" avec HMAC-SHA256 (Web Crypto natif, Edge-compatible)
async function sign(message: string): Promise<string> {
  const enc = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(message))
  return Buffer.from(sig).toString('base64url')
}

// Crée un JWT signé : header.payload.signature
export async function encrypt(payload: SessionData): Promise<string> {
  const header = Buffer.from(
    JSON.stringify({ alg: 'HS256', typ: 'JWT' })
  ).toString('base64url')

  const body = Buffer.from(JSON.stringify(payload)).toString('base64url')
  const signature = await sign(`${header}.${body}`)

  return `${header}.${body}.${signature}`
}

// Vérifie la signature puis utilise jwt-decode pour lire le payload
export async function decrypt(token: string): Promise<SessionData | null> {
  const parts = token.split('.')
  if (parts.length !== 3) return null

  const [header, body, signature] = parts
  const expected = await sign(`${header}.${body}`)

  // Vérification de signature (protection contre la falsification)
  if (signature !== expected) return null

  try {
    // jwt-decode lit le payload base64url sans re-vérifier la signature
    const data = jwtDecode<SessionData>(token)
    console.log(data);
    if (data.expiresAt < Date.now()) return null
    return data
  } catch {
    return null
  }
}

export async function createSession(
  userId: string,
  email: string,
  pseudo: string,
  role: Role
): Promise<string> {
  const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 jours
  const token = await encrypt({ userId, email, pseudo, role, expiresAt })
  const cookieStore = await cookies()

  cookieStore.set('session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: new Date(expiresAt),
    sameSite: 'lax',
    path: '/',
  })

  return token
}

export async function getSession(): Promise<SessionData | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('session')?.value
  if (!token) return null
  return decrypt(token)
}

export async function deleteSession() {
  const cookieStore = await cookies()
  cookieStore.delete('session')
}
