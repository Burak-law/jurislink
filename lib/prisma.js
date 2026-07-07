import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const globalForPrisma = globalThis;

// Vercel Serverless (Production) ortamında dosya sistemi "Read-Only" (Sadece Okunabilir) olduğu için
// SQLite veritabanımız çalışırken hata veriyor. Bunu çözmek için veritabanını yazılabilir olan
// geçici /tmp klasörüne kopyalıyoruz.
if (process.env.NODE_ENV === "production") {
  const tmpDbPath = '/tmp/dev.db';
  if (!fs.existsSync(tmpDbPath)) {
    try {
      const sourceDb = path.join(process.cwd(), 'prisma', 'dev.db');
      fs.copyFileSync(sourceDb, tmpDbPath);
      console.log("SQLite veritabanı /tmp klasörüne kopyalandı.");
    } catch (error) {
      console.error("Veritabanı kopyalama hatası:", error);
    }
  }
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    datasources: {
      db: {
        url: process.env.NODE_ENV === "production" ? "file:/tmp/dev.db" : "file:./dev.db",
      },
    },
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
