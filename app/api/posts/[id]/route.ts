import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

type Params = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const body = await req.json();

  const post = await prisma.post.update({
    where: { id: Number(id) },
    data: {
      title: body.title,
      wysiwygContent: body.wysiwygContent,
      image: body.image ?? "",
    },
  });

  return NextResponse.json({ post });
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params;

  await prisma.post.delete({
    where: {
      id: Number(id)
    }
  });

  return NextResponse.json({ success: true });
}
