import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <header className="App-header">
        <h1>🏛️ Cathedral of Circuits</h1>
        <p>ND-Safe Modular System</p>
        <p>Therapeutic Art • Music • Storytelling</p>
      </header>

      <main className="App-main">
        <div className="card">
          <h2>Welcome to the Cathedral</h2>
          <p>
            A safe space for neurodivergent-friendly art, music, and storytelling experiences.
          </p>

          <div className="button-group">
            <button onClick={() => setCount((count) => count + 1)}>
              Count is {count}
            </button>
            <button onClick={() => setCount(0)}>
              Reset
            </button>
          </div>
        </div>

        <div className="modules">
          <div className="module-card">
            <h3>🎨 Art Engine</h3>
            <p>Generate therapeutic fractal art</p>
            <button>Enter Gallery</button>
          </div>

          <div className="module-card">
            <h3>🎵 Music Engine</h3>
            <p>Create healing soundscapes</p>
            <button>Enter Studio</button>
          </div>

          <div className="module-card">
            <h3>📖 Story Engine</h3>
            <p>Experience guided narratives</p>
            <button>Begin Journey</button>
          </div>
        </div>
      </main>

      <footer className="App-footer">
        <p>🛡️ ND-Safe • 🎯 Trauma-Aware • ♿ Accessible</p>
      </footer>
    </div>
  )
}

export default App
