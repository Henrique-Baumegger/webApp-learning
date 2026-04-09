// [id] is a dynamic segment — this one file handles /games/1, /games/2, etc.
// Next.js passes the actual value via the params prop.
// Server component — renders the specific Game on the server.

export default async function GameDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <h1>Game {id}</h1>
}