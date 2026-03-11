"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

const validTypes = new Set(["濾杯", "磨豆機", "手沖壺", "其他"]);

export async function createEquipment(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const type = String(formData.get("type") ?? "").trim();
  const brandRaw = String(formData.get("brand") ?? "").trim();
  const brand = brandRaw.length > 0 ? brandRaw : null;

  if (!name || !validTypes.has(type)) {
    throw new Error("Invalid equipment data.");
  }

  await prisma.equipment.create({
    data: {
      name,
      type,
      brand,
    },
  });

  redirect("/equipment");
}
