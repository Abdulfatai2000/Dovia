import TaskDetail from "@/components/tasks/task-detail";
export default async function Page({ params }: { params: Promise<{ taskId: string }> }) {
  const { taskId } = await params;
  return <TaskDetail key={taskId} taskId={taskId} />;
}