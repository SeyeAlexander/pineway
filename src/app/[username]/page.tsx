export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const resolvedParams = await params;

  return <div>{resolvedParams.username}</div>;
}
