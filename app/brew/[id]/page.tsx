import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import BrewDetailCard from "./BrewDetailCard";
import AIChatClient from "./AIChatClient";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function BrewDetailPage({ params }: PageProps) {
  const { id } = await params;
  const recordId = parseInt(id, 10);

  if (!Number.isInteger(recordId) || recordId <= 0) {
    notFound();
  }

  const record = await prisma.brewRecord.findUnique({
    where: { id: recordId },
    include: { bean: true },
  });

  if (!record) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-6xl space-y-6 px-4 py-10 sm:px-6">
      <BrewDetailCard record={record} />
      <AIChatClient brewRecordId={record.id} />
    </main>
  );
}
