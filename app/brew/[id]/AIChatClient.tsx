"use client";

import AICoach from "@/components/AICoach";

export default function AIChatClient({
  brewRecordId,
}: {
  brewRecordId: number;
}) {
  return <AICoach brewRecordId={brewRecordId} />;
}
