import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getSession } from "@/app/lib/session";

const KEY = "about_content";

export async function GET() {
  const setting = await prisma.siteSetting.findUnique({ where: { key: KEY } });
  return NextResponse.json({ content: setting?.value ?? "" });
}

export async function POST(req: NextRequest) {
  const session = await getSession();

  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const { content } = await req.json();

  await prisma.siteSetting.upsert({
    where: { key: KEY },
    update: { value: content },
    create: { key: KEY, value: content },
  });

  return NextResponse.json({ success: true });
}
