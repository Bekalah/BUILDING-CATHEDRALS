import React, { useState, useEffect } from 'react';
import { useMode } from '../hooks/useMode';
import storyData from '../data/story-engine.json';
import characterData from '../data/characters.json';
import azureAI from '../services/azure-ai';

export default function StoryEngine({ currentRealm, codexNode, onStoryComplete }) {
  const { mode, config } = useMode();
  const [currentStory, setCurrentStory] = useState(null);
  const [currentChapter, setCurrentChapter] = useState(null);
  const [storyContent, setStoryContent] = useState('');
  const [choices, setChoices] = useState([]);
  const [playerAttributes, setPlayerAttributes] = useState(storyData.storyState.playerAttributes);
  const [isGenerating, setIsGenerating] = useState(false);
  const [visitedRealms, setVisitedRealms] = useState([]);

  // Initialize story based on current realm and codex node
  useEffect(() => {
    if (currentRealm && codexNode) {
      initializeStory(currentRealm, codexNode);
    }
  }, [currentRealm, codexNode]);

  const initializeStory = async (realm, node) => {
    // Find appropriate story arc based on realm and node
    const storyArc = findStoryArcForRealmNode(realm, node);

    if (storyArc) {
      setCurrentStory(storyArc);
      const firstChapter = storyArc.chapters[Object.keys(storyArc.chapters)[0]];
      setCurrentChapter(firstChapter);

      // Generate initial content
      await generateChapterContent(storyArc, firstChapter);
    }
  };

  const findStoryArcForRealmNode = (realm, node) => {
    // Find story arcs that match the current realm and codex node
    for (const [arcId, arc] of Object.entries(storyData.storyArcs)) {
      if (arc.startingRealm === realm && arc.triggerNode === node) {
        return arc;
      }
    }
    return null;
  };

  const generateChapterContent = async (storyArc, chapter) => {
    setIsGenerating(true);

    try {
      // Try Azure AI first, fall back to local content if unavailable
      const result = await azureAI.generateStoryContent(
        storyArc.id,
        chapter.id,
        playerAttributes
      );

      setStoryContent(result.content);
      setChoices(chapter.choices || []);
    } catch (error) {
      console.error('Story generation failed:', error);
      // Use fallback content
      setStoryContent(chapter.description || 'Continue your journey...');
      setChoices(chapter.choices || []);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleChoice = async (choice) => {
    // Update player attributes based on choice
    const newAttributes = { ...playerAttributes };
    if (choice.personalityShift) {
      Object.entries(choice.personalityShift).forEach(([attr, value]) => {
        newAttributes[attr] = Math.min(1.0, (newAttributes[attr] || 0) + value);
      });
    }
    setPlayerAttributes(newAttributes);

    // Move to next chapter
    if (choice.nextChapter && currentStory) {
      const nextChapter = currentStory.chapters[choice.nextChapter];
      if (nextChapter) {
        setCurrentChapter(nextChapter);
        await generateChapterContent(currentStory, nextChapter);
      }
    }

    // Check for story completion
    checkStoryCompletion(newAttributes);
  };

  const checkStoryCompletion = (attributes) => {
    if (!currentStory || !currentStory.endings) return;

    for (const [endingId, ending] of Object.entries(currentStory.endings)) {
      const meetsRequirements = Object.entries(ending.requirements || {}).every(
        ([attr, threshold]) => (attributes[attr] || 0) >= threshold
      );

      if (meetsRequirements) {
        // Story completed with this ending
        if (onStoryComplete) {
          onStoryComplete({
            storyId: currentStory.id,
            endingId,
            ending,
            finalAttributes: attributes
          });
        }
        break;
      }
    }
  };

  if (!currentStory || !currentChapter) {
    return (
      <div className="story-engine-placeholder">
        <div className="text-center p-8">
          <div className="text-[#FFD700] text-lg mb-4">Story Awaits</div>
          <div className="text-[#8888FF] text-sm">
            Journey through the realms to discover your story
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="story-engine bg-black bg-opacity-80 p-6 rounded-lg max-w-4xl mx-auto">
      {/* Story Header */}
      <div className="story-header mb-6">
        <h2 className="text-2xl text-[#FFD700] mb-2">{currentStory.title}</h2>
        <h3 className="text-lg text-[#8888FF] mb-4">{currentChapter.title}</h3>

        {/* Player Attributes (in learning/research modes) */}
        {config.showOutputs && (
          <div className="player-attributes mb-4">
            <div className="text-sm text-[#00FFFF] mb-2">Your Journey:</div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(playerAttributes).map(([attr, value]) => (
                <div key={attr} className="bg-[#1a1e27] px-3 py-1 rounded text-xs">
                  <span className="text-[#FFD700]">{attr}:</span>
                  <span className="text-white ml-1">{Math.round(value * 100)}%</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Story Content */}
      <div className="story-content mb-6">
        {isGenerating ? (
          <div className="text-center py-8">
            <div className="text-[#FFD700] animate-pulse">Generating story...</div>
            <div className="text-[#8888FF] text-sm mt-2">Weaving your narrative thread</div>
          </div>
        ) : (
          <div className="text-white leading-relaxed">
            {storyContent}
          </div>
        )}
      </div>

      {/* Story Choices */}
      {!isGenerating && choices.length > 0 && (
        <div className="story-choices">
          <div className="text-[#FFD700] mb-4">Choose your path:</div>
          <div className="space-y-3">
            {choices.map((choice) => (
              <button
                key={choice.id}
                onClick={() => handleChoice(choice)}
                className="w-full text-left p-4 bg-[#1a1e27] border border-[#FFD700] rounded hover:bg-[#2a2e37] transition-colors"
              >
                <div className="text-white font-medium">{choice.text}</div>
                <div className="text-[#8888FF] text-sm mt-1">
                  {choice.consequence}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Story Progress Indicator */}
      <div className="story-progress mt-6 pt-4 border-t border-[#333]">
        <div className="flex justify-between items-center text-sm">
          <span className="text-[#8888FF]">
            Chapter {Object.keys(currentStory.chapters).indexOf(currentChapter.id) + 1} of {Object.keys(currentStory.chapters).length}
          </span>
          <span className="text-[#FFD700]">
            {Math.round(Object.values(playerAttributes).reduce((a, b) => a + b, 0) / Object.keys(playerAttributes).length * 100)}% Complete
          </span>
        </div>
      </div>
    </div>
  );
}
