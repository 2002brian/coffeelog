"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function createBrewRecord(formData: FormData) {
  const beanId = parseInt(String(formData.get("beanId") ?? ""), 10);
  const dose = parseFloat(String(formData.get("dose") ?? ""));
  const water = parseFloat(String(formData.get("water") ?? ""));
  const temperature = parseFloat(String(formData.get("temperature") ?? ""));
  const equipment = String(formData.get("equipment") ?? "").trim();
  const brewTime = parseInt(String(formData.get("brewTime") ?? ""), 10);

  const grindSizeRaw = String(formData.get("grindSize") ?? "").trim();
  const grindSize = grindSizeRaw.length > 0 ? grindSizeRaw : null;

  const bloomTimeRaw = String(formData.get("bloomTime") ?? "").trim();
  const bloomTime =
    bloomTimeRaw.length > 0 ? parseInt(bloomTimeRaw, 10) : null;

  const acidity = parseInt(String(formData.get("acidity") ?? ""), 10);
  const sweetness = parseInt(String(formData.get("sweetness") ?? ""), 10);
  const body = parseInt(String(formData.get("body") ?? ""), 10);
  const bitterness = parseInt(String(formData.get("bitterness") ?? ""), 10);

  const feedbackRaw = String(formData.get("feedback") ?? "").trim();
  const feedback = feedbackRaw.length > 0 ? feedbackRaw : null;

  if (
    !Number.isInteger(beanId) ||
    !Number.isFinite(dose) ||
    !Number.isFinite(water) ||
    !Number.isFinite(temperature) ||
    equipment.length === 0 ||
    !Number.isInteger(brewTime) ||
    (bloomTime !== null && !Number.isInteger(bloomTime)) ||
    !Number.isInteger(acidity) ||
    !Number.isInteger(sweetness) ||
    !Number.isInteger(body) ||
    !Number.isInteger(bitterness)
  ) {
    throw new Error("Invalid form data.");
  }

  const sensoryScores = [acidity, sweetness, body, bitterness];
  if (sensoryScores.some((score) => score < 1 || score > 5)) {
    throw new Error("Sensory scores must be in the range of 1-5.");
  }

  await prisma.brewRecord.create({
    data: {
      beanId,
      dose,
      water,
      temperature,
      equipment,
      brewTime,
      grindSize,
      bloomTime,
      acidity,
      sweetness,
      body,
      bitterness,
      feedback,
    },
  });

  redirect("/beans");
}
