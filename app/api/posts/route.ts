import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET() {
  const posts = await prisma.post.findMany({
    include: {
      author: {
        select: { id: true, name: true, pseudo: true },
      },
    },
    orderBy: { date: "desc" },
  });
  return NextResponse.json({ posts });
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const post = await prisma.post.create({
    data: {
      title: body.title,
      wysiwygContent: body.wysiwygContent,
      image: body.image ?? "",
      authorId: Number(body.authorId),
    },
  });

  return NextResponse.json({ post }, { status: 201 });
}
