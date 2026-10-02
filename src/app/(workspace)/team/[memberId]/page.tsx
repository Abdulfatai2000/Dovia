import { PageHeader } from "@/components/ui/page-header";

export default async function Page({ params }: { params: Promise<{ memberId: string }> }) {
  const { memberId } = await params;
  return (
    <div className="space-y-3">
      <PageHeader title="Dovia Team Member" description="This page will be implemented in a later phase." />
      <p>memberId: {memberId}</p>
    </div>
  );
}
