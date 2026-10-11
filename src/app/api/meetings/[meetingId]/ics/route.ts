import { connectToDatabase } from "@/lib/db/mongoose";
import { Meeting } from "@/server/models/meeting";
import { User } from "@/server/models/user";
import { generateIcsContent, generateIcsFileName } from "@/lib/ics";
import { getCurrentUserId } from "@/lib/auth";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ meetingId: string }> }
) {
  try {
    await connectToDatabase();

    const { meetingId } = await params;
    const userId = await getCurrentUserId();
    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const meeting = await Meeting.findById(meetingId)
      .populate("organizerId", "name email")
      .lean();

    if (!meeting) {
      return new Response("Meeting not found", { status: 404 });
    }

    const isParticipant = meeting.participantIds?.some(
      (p: { _id: { toString: () => string } }) => p._id.toString() === userId
    );
    const isOrganizer = meeting.organizerId?._id?.toString() === userId;

    if (!isParticipant && !isOrganizer) {
      return new Response("Forbidden", { status: 403 });
    }

    const organizer = meeting.organizerId as { name: string; email: string } | undefined;
    const icsContent = generateIcsContent({
      ...meeting,
      organizerName: organizer?.name,
      organizerEmail: organizer?.email,
    });

    const fileName = generateIcsFileName(meeting);

    return new Response(icsContent, {
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Content-Disposition": `attachment; filename="${fileName}"`,
      },
    });
  } catch (error) {
    console.error("ICS export error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}