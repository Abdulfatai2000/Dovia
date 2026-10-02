import { PageHeader } from "@/components/ui/page-header";

export default async function Page({ params }: { params: Promise<{ meetingId: string }> }) {
  const { meetingId } = await params;
  return (
    <div className="space-y-3">
      <PageHeader title="Dovia Meeting" description="This page will be implemented in a later phase." />
      <p>meetingId: {meetingId}</p>
    </div>
  );
}
