import ClientTrack from "./ClientTrack";

export default function TrackPage({ params }: { params: { token: string } }) {
  return <ClientTrack token={params.token} />;
}
