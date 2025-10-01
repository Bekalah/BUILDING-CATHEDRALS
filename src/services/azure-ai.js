// Azure AI Integration (Front-End Facade)
// This file no longer directly imports Azure SDKs to avoid leaking credentials.
// All privileged calls are proxied through serverless functions under /api.
// ND-safe, trauma-aware, museum-grade implementation

// NOTE: The original direct SDK imports were removed. Back-end implementations now live in /api.
// If a service is unavailable, fallbacks are used.

class AzureAIService {
  constructor() {
    // Clients removed – handled server-side.
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;

    try {
      this.initialized = true;
      console.log("Azure AI facade initialized (backend functions expected)");
    } catch (error) {
      console.error("Failed to initialize Azure AI services:", error);
      // Continue without Azure services - app will work in local mode
    }
  }

  // Generate story content based on codex nodes and player state
  async generateStoryContent(storyArc, currentChapter, playerAttributes) {
    try {
      const res = await fetch("/api/generateStory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storyArc, currentChapter, playerAttributes })
      });
      if (!res.ok) throw new Error(`Backend error ${res.status}`);
      const data = await res.json();
      if (data?.content) return data;
      return this.getFallbackStoryContent(storyArc, currentChapter);
    } catch (e) {
      console.warn("Story generation backend unavailable, using fallback", e);
      return this.getFallbackStoryContent(storyArc, currentChapter);
    }
  }

  // Generate music descriptions and parameters
  async generateMusicParameters(mood, codexNode, therapeuticFocus) {
    // Phase 1: use fallback locally; future: call /api/generateMusic
    return this.getFallbackMusicParameters(mood, codexNode);
  }

  // Generate art descriptions and fractal parameters
  async generateArtParameters(style, codexNode, therapeuticFocus) {
    // Phase 1: fallback until /api/generateArt is implemented
    return this.getFallbackArtParameters(style, codexNode);
  }

  // Search knowledge base for research and learning
  async searchKnowledge(query, filters = {}) {
    // Future: route to /api/searchKnowledge
    return this.getFallbackSearchResults(query);
  }

  // Analyze uploaded art for therapeutic properties
  async analyzeArt(imageUrl, therapeuticContext) {
    // Future: call /api/analyzeArt
    return this.getFallbackArtAnalysis();
  }

  // Upload generated content to Azure Blob Storage
  async uploadContent(content, filename, metadata = {}) {
    // Future: call /api/uploadContent to get signed URL or direct upload
    return this.saveLocally(content, filename);
  }

  // Fallback methods for when Azure services are unavailable
  getFallbackStoryContent(storyArc, currentChapter) {
    return {
      content: `Continue your journey through ${storyArc}. In ${currentChapter}, you face new challenges and discoveries that will shape your path forward.`,
      metadata: {
        model: "fallback",
        generated: false,
        local: true
      }
    };
  }

  getFallbackMusicParameters(mood, codexNode) {
    return {
      baseTone: "C4",
      scale: "aeolian",
      tempo: 60,
      instruments: ["soft-synth"],
      pattern: "gentle-pulse",
      frequencies: {
        solfeggio: [396, 417, 528],
        binaural: { carrier: 136.1, offset: 4 }
      },
      metadata: {
        model: "fallback",
        therapeutic: true,
        ndSafe: true
      }
    };
  }

  getFallbackArtParameters(style, codexNode) {
    return {
      fractalType: "mandelbulb",
      colors: ["#2EA66F", "#EDEBE6", "#F2CB3D"],
      iterations: 8,
      parameters: {
        power: 8,
        scale: 2.0
      },
      metadata: {
        model: "fallback",
        therapeutic: true,
        ndSafe: true
      }
    };
  }

  getFallbackSearchResults(query) {
    return {
      results: [
        {
          id: "local-1",
          title: "Local Knowledge Base",
          content: `Search results for "${query}" from local knowledge base.`,
          type: "reference",
          score: 0.8
        }
      ],
      metadata: {
        service: "local-search",
        totalResults: 1
      }
    };
  }

  getFallbackArtAnalysis() {
    return {
      colors: ["#2EA66F", "#EDEBE6"],
      description: "Artistic composition with therapeutic potential",
      tags: ["abstract", "geometric", "calming"],
      therapeutic: {
        ndSafe: true,
        traumaAware: true,
        mood: "neutral-positive"
      },
      metadata: {
        service: "local-analysis",
        analyzed: false
      }
    };
  }

  saveLocally(content, filename) {
    // Save to local storage or trigger download
    const blob = new Blob([content], { type: this.getContentType(filename) });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();

    URL.revokeObjectURL(url);

    return {
      url: `local://${filename}`,
      metadata: {
        service: "local-storage",
        downloaded: true,
        filename
      }
    };
  }

  // Helper methods
  buildStoryPrompt(storyArc, currentChapter, playerAttributes) {
    return `Generate trauma-aware, ND-safe narrative content for a therapeutic storytelling system.

Story Arc: ${storyArc}
Current Chapter: ${currentChapter}
Player State: ${JSON.stringify(playerAttributes)}

Requirements:
- Keep content gentle and supportive
- No violence, trauma triggers, or disturbing imagery
- Focus on healing, growth, and positive transformation
- Use archetypal imagery appropriate for therapeutic work
- Maintain hope and possibility throughout

Generate a 200-300 word narrative segment that continues the story in a healing direction.`;
  }

  buildSearchFilter(filters) {
    const filterParts = [];

    if (filters.codexNode) {
      filterParts.push(`codexNode eq '${filters.codexNode}'`);
    }

    if (filters.type) {
      filterParts.push(`type eq '${filters.type}'`);
    }

    if (filters.therapeutic) {
      filterParts.push(`therapeutic eq true`);
    }

    return filterParts.join(" and ");
  }

  assessTherapeuticProperties(analysis, context) {
    const colors = analysis.color?.dominantColors || [];
    const description = analysis.description?.captions[0]?.text || "";

    return {
      ndSafe: this.isNDSafe(colors, description),
      traumaAware: this.isTraumaAware(description),
      mood: this.assessMood(colors, description),
      recommendations: this.getTherapeuticRecommendations(colors, context)
    };
  }

  isNDSafe(colors, description) {
    // Check against TARA-21 safe colors and avoid problematic patterns
    const unsafeColors = ["#FF0000", "#000000"]; // Add more as needed
    const hasUnsafeColors = colors.some(color => unsafeColors.includes(color));

    const hasStrobeWords = /\b(strobe|flash|blink|seizure)\b/i.test(description);

    return !hasUnsafeColors && !hasStrobeWords;
  }

  isTraumaAware(description) {
    const traumaTriggers = /\b(violence|death|abuse|trauma|wound|scar)\b/i;
    return !traumaTriggers.test(description);
  }

  assessMood(colors, description) {
    if (colors.includes("#2EA66F") || colors.includes("#EDEBE6")) {
      return "calming";
    }
    if (colors.includes("#FFD700") || colors.includes("#F2CB3D")) {
      return "uplifting";
    }
    return "neutral";
  }

  getTherapeuticRecommendations(colors, context) {
    const recommendations = [];

    if (colors.includes("#2EA66F")) {
      recommendations.push("Good for grounding and stability work");
    }

    if (colors.includes("#9370DB")) {
      recommendations.push("Supports intuition and spiritual connection");
    }

    if (context.includes("trauma")) {
      recommendations.push("Use with trauma-aware facilitation");
    }

    return recommendations;
  }

  getContentType(filename) {
    const ext = filename.split(".").pop().toLowerCase();
    const types = {
      "png": "image/png",
      "jpg": "image/jpeg",
      "jpeg": "image/jpeg",
      "gif": "image/gif",
      "webp": "image/webp",
      "svg": "image/svg+xml",
      "json": "application/json",
      "txt": "text/plain",
      "md": "text/markdown"
    };
    return types[ext] || "application/octet-stream";
  }
}

// Export singleton instance
export const azureAI = new AzureAIService();

// Initialize on module load
azureAI.initialize().catch(console.error);

export default azureAI;
