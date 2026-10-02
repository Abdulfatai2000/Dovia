import { PageHeader } from "@/components/ui/page-header";

export default async function Page({ params }: { params: Promise<{ taskId: string }> }) {
  const { taskId } = await params;
  return (
    <div className="space-y-3">
      <PageHeader title="Dovia Task" description="This page will be implemented in a later phase." />
      <p>taskId: {taskId}</p>
    </div>
  );
}
