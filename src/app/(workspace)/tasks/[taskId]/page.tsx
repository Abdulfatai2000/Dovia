import TaskDetail from "@/components/tasks/task-detail";
export default async function Page({ params }: { params: Promise<{ taskId: string }> }) {
  const { taskId } = await params;
  // Generated IDs contain colons; normalize the encoded route segment before lookup.
  let id = taskId;
  try { id = decodeURIComponent(taskId); } catch { /* Malformed IDs use the normal not-found state. */ }
  return <TaskDetail key={id} taskId={id} />;
}
