export default function App() {
  const [view, setView] = useState('story');
  return (
    <div className="grimoire-bg min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-[#FFD700] mb-6 drop-shadow-lg">Stone Grimoire</h1>
      <div className="mb-4 flex gap-4">
        <button
          onClick={() => setView('story')}
          className={`px-4 py-2 rounded font-bold transition-colors text-xs ${view === 'story' ? 'bg-[#FFD700] text-[#1a1e27]' : 'bg-[#9370DB] text-white'}`}
        >
          Story
        </button>
        <button
          onClick={() => setView('gallery')}
          className={`px-4 py-2 rounded font-bold transition-colors text-xs ${view === 'gallery' ? 'bg-[#FFD700] text-[#1a1e27]' : 'bg-[#9370DB] text-white'}`}
        >
          Art Gallery
        </button>
        <button
          onClick={() => setView('generative')}
          className={`px-4 py-2 rounded font-bold transition-colors text-xs ${view === 'generative' ? 'bg-[#FFD700] text-[#1a1e27]' : 'bg-[#9370DB] text-white'}`}
        >
          Generative Art
        </button>
      </div>
      {view === 'story' && <CYOA />}
      {view === 'gallery' && <ArtGallery />}
      {view === 'generative' && <GenerativeArt />}
    </div>
  );
}
