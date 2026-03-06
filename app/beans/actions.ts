"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function addCoffeeBean(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const origin = String(formData.get("origin") ?? "").trim();
  const roastLevel = String(formData.get("roastLevel") ?? "").trim();
  const process = String(formData.get("process") ?? "").trim();
  const notesRaw = String(formData.get("notes") ?? "").trim();
  const notes = notesRaw.length > 0 ? notesRaw : null;

  if (!name || !origin || !roastLevel || !process) {
    throw new Error("Missing required fields.");
  }

  await prisma.coffeeBean.create({
    data: {
      name,
      origin,
      roastLevel,
      process,
      notes,
    },
  });

  revalidatePath("/beans");
}
