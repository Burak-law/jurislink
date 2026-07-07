import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

function slugify(text) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           
    .replace(/[^\w\-]+/g, '')       
    .replace(/\-\-+/g, '-')         
    .replace(/^-+/, '')             
    .replace(/-+$/, '');            
}

export async function POST(req) {
  try {
    const { title, content, authorName, category } = await req.json();

    if (!title || !content || !authorName || !category) {
      return NextResponse.json({ error: "Eksik bilgi" }, { status: 400 });
    }

    const baseSlug = slugify(title);
    const slug = `${baseSlug}-${Math.random().toString(36).substring(2, 6)}`;

    const thread = await prisma.forumThread.create({
      data: {
        title,
        content,
        authorName,
        category,
        slug,
      }
    });

    return NextResponse.json({ success: true, thread });
  } catch (error) {
    console.error("Error creating forum thread:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
