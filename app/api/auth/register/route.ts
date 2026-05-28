import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { signToken } from "@/app/lib/jwt";

export async function POST(req: NextRequest) {
  const { email, pseudo, password, name } = await req.json();

  if (!email || !pseudo || !password) {
    return NextResponse.json({ error: "Email, pseudo et mot de passe requis" }, { status: 400 });
  }

  const existing = await prisma.author.findFirst({
    where: { OR: [{ email }, { pseudo }] },
  });

  if (existing) {
    const field = existing.email === email ? "email" : "pseudo";
    return NextResponse.json({ error: `Ce ${field} est déjà utilisé` }, { status: 409 });
  }

  const author = await prisma.author.create({
    data: {
      email,
      pseudo,
      password,
      name: name ?? pseudo,
      bio: "",
      avatar: "",
      interests: [],
      role: "BLOGGER",
    },
  });

  const token = await signToken({
    id: author.id,
    email: author.email,
    pseudo: author.pseudo,
    role: author.role,
  });
  console.log(token);

  return NextResponse.json({ token, role: author.role }, { status: 201 });
}
