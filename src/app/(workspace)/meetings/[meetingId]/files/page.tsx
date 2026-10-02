export default async function Page({ params }: { params: Promise<{ meetingId: string }> }) {
  const { meetingId } = await params;
  return (
    <main>
      <h1>Dovia Meeting files</h1>
      <p>meetingId: {meetingId}</p>
      <p>This page will be implemented in a later phase.</p>
    </main>
  );
}
