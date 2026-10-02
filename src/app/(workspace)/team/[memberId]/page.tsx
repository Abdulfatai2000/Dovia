export default async function Page({ params }: { params: Promise<{ memberId: string }> }) {
  const { memberId } = await params;
  return (
    <main>
      <h1>Dovia Team Member</h1>
      <p>memberId: {memberId}</p>
      <p>This page will be implemented in a later phase.</p>
    </main>
  );
}
