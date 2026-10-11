"use client";

import { CalendarPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface AddToCalendarButtonProps {
  meetingId: string;
  meetingTitle: string;
  className?: string;
}

export default function AddToCalendarButton({ meetingId, meetingTitle, className }: AddToCalendarButtonProps) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const response = await fetch(`/api/meetings/${meetingId}/ics`);
      if (!response.ok) {
        throw new Error("Failed to generate calendar file");
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${meetingTitle.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.ics`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Failed to download .ics file:", error);
      alert("Failed to download calendar file. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleDownload}
      disabled={downloading}
      className={className}
    >
      <CalendarPlus aria-hidden="true" className="size-4 mr-2" />
      {downloading ? "Preparing..." : "Add to Calendar"}
    </Button>
  );
}