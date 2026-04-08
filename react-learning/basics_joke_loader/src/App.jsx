import { useState } from 'react' 
import './App.css'

// ─── REACT MENTAL MODEL ──────────────────────────────────────────────────────
// UI is a function of state. You manage data, React manages the DOM.
// When state changes → component re-renders → DOM updates automatically.
// You never touch the DOM directly.

// ─── COMPONENTS ──────────────────────────────────────────────────────────────
// A component is a JavaScript function that returns JSX.
// The whole function re-runs on every render.
// Must be PascalCase so React distinguishes them from HTML tags (<div> vs <JokeArea>).
// Self-closing when no children: <JokeArea />

// ─── JSX ─────────────────────────────────────────────────────────────────────
// Looks like HTML, compiles to React.createElement() calls — not real HTML.
// Differences from HTML: class→className, onclick→onClick, void tags must self-close.
// React uses "Synthetic Events" — wrappers around native browser DOM events.(In practice they behave identically)
// {} embeds any JavaScript expression: <h1>{myVariable}</h1>
// Must return a single root — use <></> (Fragment) to avoid extra DOM nodes (or just use <div>).

// ─── PROPS ───────────────────────────────────────────────────────────────────
// How a parent passes data down to a child component.
// Arrive as a plain JS object. Two ways to receive them:
//   function Hello(props)           → props.name
//   function Hello({ name , age })        → name  (destructured, more common)
// Usage: <Hello name="Ana" age={21} />
// Props are read-only — a child never modifies its own props.

function Hello({ name, age }) {
  return <p>{name} is {age} years old.</p>
}

// ─── STATE ───────────────────────────────────────────────────────────────────
// Data React tracks. Changing state triggers a re-render.
// useState(initial) returns [value, setter].
// Always update via the setter — never mutate directly.
// Store raw data in state. Produce JSX from it at render time.

function JokeArea() {

  const [jokes, setJokes] = useState([]) // Initialize "jokes" array as []

  async function handleClick() {
    const response = await fetch('https://v2.jokeapi.dev/joke/Any?type=twopart')
    const data = await response.json()  // stream — separate await needed to read body
    const newJoke = data.setup + '... ' + data.delivery
    setJokes(jokes.concat(newJoke))  // concat returns new array, push does not
  }

  return (
    <>
      <button onClick={handleClick}>Add joke</button>
      <ul>
        {jokes.map((joke, index) => <li key={index}> {joke} </li>)}
        {/* .map() maps each element of the given array (jokes) from string to JSX-expression (AKA HTML element), returning a new array React can render */}
        {/* Takes (element, index) — index is injected automatically by .map(), no need to provide it, so is element */}
        {/* key helps React track items across re-renders — use unique IDs in real apps */}
      </ul>
    </>
  )
}

// ─── APP STRUCTURE ───────────────────────────────────────────────────────────
// App is the root component. It composes the rest of the UI.
// Real projects: App handles routing and global layout.
// Feature logic lives in dedicated components, not in App directly.
// main.jsx mounts App into the single <div id="root"> in index.html —
// the rest of the DOM is built entirely by React.

function App() {
  return (
    <div>
      <Hello name="Gustapa" age={21} />
      <JokeArea />
    </div>
  )
}

export default App

/*
  References:
  React docs:       https://react.dev/learn
  MDN React intro:  https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Frameworks_libraries/React_getting_started
  Events:           https://react.dev/reference/react-dom/components/common
*/