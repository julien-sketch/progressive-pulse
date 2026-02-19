import ClientTrack from "./ClientTrack";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function TrackPage({ params }: { params: { token: string } }) {
  // Important : on force la valeur en string
  const token = String(params?.token ?? "");
  return <ClientTrack token={token} />;
}
