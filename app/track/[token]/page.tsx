import ClientTrack from "./ClientTrack";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Params = { token: string };

export default async function TrackPage({
  params,
}: {
  params: Params | Promise<Params>;
}) {
  const resolved = await Promise.resolve(params);
  const token = String(resolved?.token ?? "").trim();

  return <ClientTrack token={token} />;
}
