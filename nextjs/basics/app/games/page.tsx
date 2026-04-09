import FilterInput from '../_components/FilterInput'

// app/games/page.tsx → "/games"
// Folder name = URL segment. page.tsx = what renders at that URL.

// Server component — fetches data on the server, no loading state needed,
// data is already in the HTML when it reaches the browser.

// In real app this would fetch from FastAPI:
// const games = await fetch('http://localhost:8000/games').then(r => r.json())
const games = [
  { id: 1, title: "Omori" },
  { id: 2, title: "Silksong" },
]


export default function GamesPage() {
  return (
    <div>

      <h1>games</h1>

      {/* interactive island inside a server page — search needs useState */}
      <FilterInput />
      
      {games.map(games => (
        <div key={games.id}>
          <a href={`/games/${games.id}`}>{games.title}</a>
          {/* navigation = just a link, no useState needed */}
          {/* We are routing to "/games/[id]", AKA "App/games/[id]" */}
        </div>
      ))}

    </div>
  )
}