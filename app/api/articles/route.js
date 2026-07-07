import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

function slugify(text) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}

export async function POST(req) {
  try {
    const { title, content, authorName } = await req.json();

    if (!title || !content || !authorName) {
      return NextResponse.json({ error: "Eksik bilgi" }, { status: 400 });
    }

    const baseSlug = slugify(title);
    const slug = `${baseSlug}-${Math.random().toString(36).substring(2, 6)}`; // prevent dupes

    const article = await prisma.article.create({
      data: {
        title,
        content,
        authorName,
        slug,
      }
    });

    return NextResponse.json({ success: true, article });
  } catch (error) {
    console.error("Error creating article:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
