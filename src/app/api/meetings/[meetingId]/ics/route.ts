import { connectToDatabase } from "@/lib/db/mongoose";
import { Meeting } from "@/server/models/meeting";
import { generateIcsContent, generateIcsFileName } from "@/lib/ics";
import { requireWorkspaceSession } from "@/server/workspace-session";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ meetingId: string }> }
) {
  try {
    await connectToDatabase();

    const { meetingId } = await params;
    const { userId, workspaceId } = await requireWorkspaceSession();

    const meeting = await Meeting.findOne({ _id: meetingId, workspaceId })
      .populate("organizerId", "name email")
      .lean();

    if (!meeting) {
      return new Response("Meeting not found", { status: 404 });
    }

    const isParticipant = meeting.participantIds?.some(
      (p: { _id: { toString: () => string } }) => p._id.toString() === userId
    );
    const organizerId = meeting.organizerId as { _id: { toString: () => string } } | { name: string; email: string } | undefined;
    const isOrganizer = organizerId && "_id" in organizerId ? organizerId._id.toString() === userId : false;

    if (!isParticipant && !isOrganizer) {
      return new Response("Forbidden", { status: 403 });
    }

    const organizer = organizerId && "name" in organizerId ? organizerId : undefined;
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