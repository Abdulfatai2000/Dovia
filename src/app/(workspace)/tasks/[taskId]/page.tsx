export default async function Page({ params }: { params: Promise<{ taskId: string }> }) {
  const { taskId } = await params;
  return (
    <main>
      <h1>Dovia Task</h1>
      <p>taskId: {taskId}</p>
      <p>This page will be implemented in a later phase.</p>
    </main>
  );
}
