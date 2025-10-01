import React, { useState, useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text, Stars } from '@react-three/drei';
import { ModeProvider, useMode } from './hooks/useMode';
import ModeToggle from './components/ModeToggle';
import GuideOverlay from './components/GuideOverlay';
import StoryEngine from './components/StoryEngine';
import MusicEngine from './components/MusicEngine';
import ArtEngine from './components/ArtEngine';
import codexData from './data/codex_144_99.json';
import realmData from './data/realms.json';

function CathedralScene({ selectedNode, onNodeSelect }) {

  return (
    <>
      <ambientLight intensity={0.15} />
      <pointLight position={[5, 5, 5]} intensity={1.2} color="#FFD700" />
      <pointLight position={[-5, -5, -5]} intensity={0.8} color="#4A90E2" />

      <Suspense fallback={null}>
        <Stars radius={100} depth={50} count={5000} factor={4} />

        {/* Central Codex Structure */}
        <mesh position={[0, 0, -5]}>
          <cylinderGeometry args={[0.5, 1, 10, 32]} />
          <meshBasicMaterial color="#8888FF" transparent opacity={0.2} />
        </mesh>

        {/* Codex Nodes */}
        {Object.values(codexData.nodes).map((node, i) => {
          const angle = (i / Object.keys(codexData.nodes).length) * Math.PI * 2;
          const radius = 4 + (i % 2) * 1.5;

          return (
            <group key={node.id} position={[
              Math.cos(angle) * radius,
              Math.sin(angle) * radius,
              0
            ]}>
              <mesh onClick={() => onNodeSelect(node)}>
                <sphereGeometry args={[0.3, 32, 32]} />
                <meshPhongMaterial
                  color={node.element === 'water' ? "#4A90E2" :
                         node.element === 'fire' ? "#FFD700" : "#9370DB"}
                  emissive={node.element === 'water' ? "#2A5082" :
                           node.element === 'fire' ? "#8B7500" : "#4B3668"}
                  transparent
                  opacity={0.8}
                />
              </mesh>
              <Text
                position={[0, 0.6, 0]}
                fontSize={0.15}
                color="#FFD700"
                anchorX="center"
                anchorY="middle"
              >
                {node.name}
              </Text>
            </group>
          );
        })}

        <Text
          position={[0, 6, 0]}
          fontSize={0.4}
          color="#FFD700"
          anchorX="center"
          anchorY="middle"
        >
          CATHEDRAL OF CIRCUITS
        </Text>
        <Text
          position={[0, 5.3, 0]}
          fontSize={0.2}
          color="#8888FF"
          anchorX="center"
          anchorY="middle"
        >
          Choose Your Codex Node • Explore • Create • Transform
        </Text>
      </Suspense>
    </>
  );
}

export default function App() {
  const [selectedNode, setSelectedNode] = useState(null);
  const [currentView, setCurrentView] = useState('cathedral'); // cathedral, story, music, art
  const [showGuide, setShowGuide] = useState(false);
  const canvasRef = useRef();

  const handleNodeSelect = (node) => {
    setSelectedNode(node);
    // Auto-switch to appropriate view based on node type
    if (node.type === 'archetype') {
      setCurrentView('story');
    } else if (node.element === 'fire') {
      setCurrentView('music');
    } else {
      setCurrentView('art');
    }
  };

  const handleStoryComplete = (result) => {
    console.log('Story completed:', result);
    // Could trigger realm transition or new story arc
  };

  const handleMusicGenerated = (musicParams) => {
    console.log('Music generated:', musicParams);
    // Could save to playlist or trigger visual effects
  };

  const handleArtGenerated = (artParams) => {
    console.log('Art generated:', artParams);
    // Could add to gallery or trigger realm effects
  };

  return (
    <ModeProvider>
      <div className="w-full h-screen bg-[#0a0e17] relative overflow-hidden">
        {/* Main 3D Scene */}
        <div ref={canvasRef} className="w-full h-full">
          <Canvas
            camera={{ position: [0, 0, 8], fov: 60 }}
            gl={{ preserveDrawingBuffer: true }}
          >
            <CathedralScene
              selectedNode={selectedNode}
              onNodeSelect={handleNodeSelect}
            />
            <OrbitControls
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              minDistance={5}
              maxDistance={20}
            />
          </Canvas>
        </div>

        {/* UI Overlay */}
        <div className="absolute top-4 left-4 z-10">
          <div className="bg-black bg-opacity-70 p-3 rounded">
            <div className="font-bold text-[#FFD700] text-sm mb-2">Cathedral of Circuits</div>
            <ModeToggle />

            {/* View Selection (in learning/research modes) */}
            {selectedNode && (
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => setCurrentView('story')}
                  className={`px-2 py-1 rounded text-xs transition-colors ${
                    currentView === 'story'
                      ? 'bg-[#FFD700] text-[#0a0e17]'
                      : 'bg-[#1a1e27] text-[#8888FF] hover:bg-[#2a2e37]'
                  }`}
                >
                  📖 Story
                </button>
                <button
                  onClick={() => setCurrentView('music')}
                  className={`px-2 py-1 rounded text-xs transition-colors ${
                    currentView === 'music'
                      ? 'bg-[#FFD700] text-[#0a0e17]'
                      : 'bg-[#1a1e27] text-[#8888FF] hover:bg-[#2a2e37]'
                  }`}
                >
                  🎵 Music
                </button>
                <button
                  onClick={() => setCurrentView('art')}
                  className={`px-2 py-1 rounded text-xs transition-colors ${
                    currentView === 'art'
                      ? 'bg-[#FFD700] text-[#0a0e17]'
                      : 'bg-[#1a1e27] text-[#8888FF] hover:bg-[#2a2e37]'
                  }`}
                >
                  🎨 Art
                </button>
              </div>
            )}

            <button
              onClick={() => setShowGuide(true)}
              className="mt-2 text-xs text-[#00FFFF] hover:text-[#FFD700] transition-colors"
            >
              📖 Guide
            </button>
          </div>
        </div>

        {/* Guide Overlay */}
        {showGuide && (
          <GuideOverlay onClose={() => setShowGuide(false)} />
        )}

        {/* Interactive Engines */}
        {selectedNode && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-full max-w-6xl pointer-events-auto">
              {currentView === 'story' && (
                <StoryEngine
                  currentRealm={realmData.realms.frontispiece}
                  codexNode={selectedNode.id}
                  onStoryComplete={handleStoryComplete}
                />
              )}
              {currentView === 'music' && (
                <MusicEngine
                  codexNode={selectedNode.id}
                  therapeuticFocus="trauma-healing"
                  onMusicGenerated={handleMusicGenerated}
                />
              )}
              {currentView === 'art' && (
                <ArtEngine
                  codexNode={selectedNode.id}
                  therapeuticFocus="creative-blocks"
                  onArtGenerated={handleArtGenerated}
                />
              )}
            </div>
          </div>
        )}

        {/* Node Information Panel */}
        {selectedNode && (
          <div className="absolute bottom-4 right-4 z-10 max-w-sm">
            <div className="bg-black bg-opacity-80 p-4 rounded">
              <h3 className="text-[#FFD700] text-sm mb-2">{selectedNode.name}</h3>
              <p className="text-[#8888FF] text-xs mb-2">{selectedNode.description}</p>
              <div className="text-xs text-white">
                <div>Type: {selectedNode.type}</div>
                <div>Element: {selectedNode.element}</div>
                <div>Chakra: {selectedNode.chakra}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ModeProvider>
  );
}
