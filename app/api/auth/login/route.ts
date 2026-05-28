import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { signToken, decodeToken } from "@/app/lib/jwt";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ error: "Email et mot de passe requis" }, { status: 400 });
  }

  const author = await prisma.author.findUnique({ where: { email } });

  if (!author || author.password !== password) {
    return NextResponse.json({ error: "Identifiants invalides" }, { status: 401 });
  }

  const token = await signToken({
    id: author.id,
    email: author.email,
    pseudo: author.pseudo,
    role: author.role,
  });

  console.log("[login] token payload décodé :", decodeToken(token));

  return NextResponse.json({ token, role: author.role });
}
