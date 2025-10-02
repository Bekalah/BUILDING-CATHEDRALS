#!/usr/bin/env python3
"""
Game & Interactive Experience Engine
Transforms book wisdom into immersive games, quests, and interactive experiences
Creates everything from simple card games to complex RPG systems
"""

import sqlite3
import json
import random
from datetime import datetime

class GameEngine:
    def __init__(self, db_path="../books.db"):
        self.db_path = db_path
        
        # Game archetypes and mechanics
        self.game_types = {
            "card_game": {
                "mechanics": ["deck building", "hand management", "resource collection"],
                "themes": ["mystical journey", "wisdom gathering", "spiritual evolution"],
                "components": ["oracle cards", "action cards", "character cards", "resource tokens"]
            },
            "rpg_system": {
                "mechanics": ["character progression", "skill trees", "quest systems"],
                "themes": ["initiate's journey", "occult investigation", "magical academy"],
                "components": ["character sheets", "dice systems", "advancement tracks"]
            },
            "puzzle_game": {
                "mechanics": ["pattern matching", "sacred geometry", "symbol decoding"],
                "themes": ["alchemical puzzles", "kabbalah tree navigation", "tarot sequences"],
                "components": ["puzzle boards", "symbol tiles", "solution guides"]
            },
            "meditation_app": {
                "mechanics": ["guided journeys", "binaural beats", "progress tracking"],
                "themes": ["chakra activation", "astral projection", "shadow work"],
                "components": ["audio guides", "visual mandalas", "journal prompts"]
            }
        }
        
        # Character archetypes for RPG systems
        self.character_archetypes = {
            "seeker": {
                "stats": {"wisdom": 8, "intuition": 7, "energy": 5, "focus": 6},
                "abilities": ["divine insight", "truth detection", "wisdom channeling"],
                "starting_items": ["traveler's journal", "pendulum", "meditation beads"]
            },
            "healer": {
                "stats": {"wisdom": 6, "intuition": 8, "energy": 7, "focus": 5},
                "abilities": ["energy healing", "aura reading", "emotional balance"],
                "starting_items": ["crystal set", "healing herbs", "sacred oils"]
            },
            "magus": {
                "stats": {"wisdom": 7, "intuition": 6, "energy": 6, "focus": 8},
                "abilities": ["ritual casting", "sigil creation", "elemental control"],
                "starting_items": ["ritual dagger", "grimoire", "elemental tokens"]
            },
            "guardian": {
                "stats": {"wisdom": 5, "intuition": 6, "energy": 8, "focus": 7},
                "abilities": ["protection ward", "banishing", "psychic shield"],
                "starting_items": ["protective amulet", "salt circle", "banishing bell"]
            }
        }
    
    def generate_card_game(self, passage_data):
        """Generate a mystical card game from book passage"""
        
        concepts = self._extract_game_concepts(passage_data['content'])
        tradition = passage_data.get('tradition', 'mystical')
        
        game = {
            "name": self._generate_game_name(passage_data, concepts),
            "type": "card_game",
            "theme": tradition.title() + " Wisdom Quest",
            "players": "2-4 players",
            "age_range": "14+",
            "play_time": "30-60 minutes",
            "inspiration": {
                "source_book": passage_data.get('book_title', ''),
                "author": passage_data.get('author', ''),
                "key_passage": passage_data['content'][:200] + "..."
            },
            "core_mechanics": self._generate_card_mechanics(concepts, tradition),
            "card_types": self._generate_card_types(concepts, tradition),
            "win_conditions": self._generate_win_conditions(concepts),
            "sample_cards": self._generate_sample_cards(concepts, tradition),
            "expansion_ideas": self._generate_expansion_ideas(concepts, tradition),
            "art_style": self._generate_art_style(tradition)
        }
        
        return game
    
    def generate_rpg_system(self, passage_data):
        """Generate RPG system from book wisdom"""
        
        concepts = self._extract_game_concepts(passage_data['content'])
        tradition = passage_data.get('tradition', 'mystical')
        
        rpg = {
            "name": self._generate_rpg_name(passage_data, concepts),
            "genre": "Mystical/Occult Investigation",
            "setting": self._generate_rpg_setting(tradition, concepts),
            "core_system": self._generate_core_mechanics(tradition),
            "character_creation": self._generate_character_system(tradition),
            "magic_system": self._generate_magic_system(concepts, tradition),
            "campaign_framework": self._generate_campaign_framework(passage_data, concepts),
            "sample_adventure": self._generate_sample_adventure(passage_data, concepts),
            "bestiary": self._generate_mystical_creatures(tradition),
            "artifacts": self._generate_mystical_artifacts(concepts, tradition),
            "gm_tools": self._generate_gm_tools(tradition)
        }
        
        return rpg
    
    def generate_interactive_experience(self, passage_data, experience_type="meditation_app"):
        """Generate interactive digital experience"""
        
        concepts = self._extract_game_concepts(passage_data['content'])
        tradition = passage_data.get('tradition', 'mystical')
        
        experience = {
            "name": self._generate_experience_name(passage_data, concepts),
            "type": experience_type,
            "platform": ["iOS", "Android", "Web"],
            "target_audience": "Spiritual seekers, meditation practitioners",
            "core_features": self._generate_experience_features(experience_type, concepts),
            "user_journey": self._generate_user_journey(passage_data, concepts),
            "gamification": self._generate_gamification_elements(concepts),
            "content_structure": self._generate_content_structure(passage_data, concepts),
            "monetization": self._generate_monetization_strategy(),
            "technical_requirements": self._generate_tech_requirements(experience_type)
        }
        
        return experience
    
    def _extract_game_concepts(self, text):
        """Extract game-relevant concepts from text"""
        concepts = {}
        text_lower = text.lower()
        
        # Game mechanics inspiration
        action_words = ["journey", "quest", "challenge", "trial", "initiation", "transformation"]
        found_actions = [word for word in action_words if word in text_lower]
        if found_actions:
            concepts["actions"] = found_actions
        
        # Mystical elements for game mechanics
        mystical_elements = ["ritual", "meditation", "divination", "spell", "sigil", "talisman"]
        found_mystical = [elem for elem in mystical_elements if elem in text_lower]
        if found_mystical:
            concepts["mystical"] = found_mystical
        
        # Progression concepts
        progression_words = ["level", "degree", "stage", "phase", "evolution", "ascension"]
        found_progression = [word for word in progression_words if word in text_lower]
        if found_progression:
            concepts["progression"] = found_progression
        
        # Challenge types
        challenge_words = ["test", "trial", "obstacle", "puzzle", "riddle", "mystery"]
        found_challenges = [word for word in challenge_words if word in text_lower]
        if found_challenges:
            concepts["challenges"] = found_challenges
        
        return concepts
    
    def _generate_game_name(self, passage_data, concepts):
        """Generate mystical game name"""
        book_words = passage_data.get('book_title', '').split()[:2]
        
        name_templates = [
            "{book}: The Card Game",
            "Mysteries of {concept}",
            "The {concept} Chronicles",
            "Sacred {concept} Quest",
            "{author}'s {concept} Game"
        ]
        
        concept = "Wisdom"
        if concepts and concepts.get("actions"):
            concept = concepts["actions"][0].title()
        elif concepts and concepts.get("mystical"):
            concept = concepts["mystical"][0].title()
        
        template = random.choice(name_templates)
        return template.format(
            book=' '.join(book_words) if book_words else "Ancient",
            concept=concept,
            author=passage_data.get('author', '').split()[0] if passage_data.get('author') != "Unknown" else "Sage"
        )
    
    def _generate_card_mechanics(self, concepts, tradition):
        """Generate core card game mechanics"""
        base_mechanics = {
            "wisdom_gathering": "Collect wisdom cards to advance your spiritual understanding",
            "energy_management": "Balance different types of mystical energy to power abilities",
            "ritual_sequences": "Play cards in specific sequences to perform powerful rituals",
            "shadow_work": "Face and integrate challenging shadow cards to grow",
            "divine_connection": "Build connection with divine forces through proper card combinations"
        }
        
        # Select 3 core mechanics
        selected = random.sample(list(base_mechanics.items()), 3)
        return dict(selected)
    
    def _generate_card_types(self, concepts, tradition):
        """Generate different types of cards in the game"""
        card_types = {
            "wisdom_cards": {
                "count": 30,
                "function": "Provide teachings and advance spiritual progress",
                "examples": ["The Hermit's Lamp", "Sacred Geometry", "Divine Proportion"]
            },
            "challenge_cards": {
                "count": 20,
                "function": "Present obstacles that must be overcome or integrated",
                "examples": ["Dark Night of Soul", "Ego Dissolution", "Sacred Trauma"]
            },
            "ally_cards": {
                "count": 15,
                "function": "Spiritual guides and helpers",
                "examples": ["Inner Teacher", "Guardian Angel", "Wise Elder"]
            },
            "ritual_cards": {
                "count": 25,
                "function": "Powerful actions that can change game state",
                "examples": ["Meditation Circle", "Energy Clearing", "Divine Invocation"]
            }
        }
        
        return card_types
    
    def _generate_sample_cards(self, concepts, tradition):
        """Generate sample cards with full specifications"""
        samples = [
            {
                "name": "The Seeker's Path",
                "type": "Wisdom",
                "cost": 2,
                "effect": "Draw 2 cards and gain 1 Wisdom token",
                "flavor_text": "Every journey begins with a single step into the unknown",
                "art_description": "Figure walking toward distant light with sacred geometry overlay"
            },
            {
                "name": "Shadow Integration",
                "type": "Challenge", 
                "cost": 0,
                "effect": "All players must discard their highest cost card, then draw 1",
                "flavor_text": "What we resist in ourselves becomes our greatest teacher",
                "art_description": "Dual figure embracing light and shadow aspects"
            },
            {
                "name": "Divine Inspiration",
                "type": "Ritual",
                "cost": 4,
                "effect": "Search your deck for any Wisdom card and play it for free",
                "flavor_text": "When the student is ready, the teacher appears",
                "art_description": "Radiant light descending into open hands"
            }
        ]
        
        return samples
    
    def _generate_rpg_setting(self, tradition, concepts):
        """Generate RPG setting description"""
        settings = {
            "hermetic": "Modern world where ancient alchemical societies operate in secret, using mystical sciences to transform reality",
            "thelemic": "Early 20th century occult revival period, with secret lodges competing for magical supremacy",
            "healing": "Contemporary setting where energy healers form underground networks to help humanity's spiritual evolution",
            "mystical": "Multi-dimensional reality where players navigate both physical and astral planes"
        }
        
        return settings.get(tradition, settings["mystical"])
    
    def _generate_magic_system(self, concepts, tradition):
        """Generate magic system for RPG"""
        magic_system = {
            "name": f"{tradition.title()} Arts",
            "power_source": "Personal spiritual development and connection to divine forces",
            "casting_method": "Combination of ritual, intention, and energy manipulation",
            "limitations": "Magic requires genuine spiritual growth and ethical alignment",
            "schools": self._generate_magic_schools(tradition),
            "advancement": "Magical ability grows through wisdom, experience, and initiation"
        }
        
        return magic_system
    
    def _generate_magic_schools(self, tradition):
        """Generate schools of magic"""
        schools = {
            "hermetic": ["Alchemy", "Sacred Geometry", "Planetary Magic", "Elemental Arts"],
            "thelemic": ["True Will", "Sacred Sexuality", "Ceremonial Magic", "Enochian"],
            "healing": ["Energy Medicine", "Chakra Work", "Crystal Healing", "Plant Spirit"],
            "mystical": ["Astral Projection", "Divination", "Manifestation", "Spirit Communication"]
        }
        
        return schools.get(tradition, schools["mystical"])
    
    def _generate_campaign_framework(self, passage_data, concepts):
        """Generate campaign structure"""
        framework = {
            "campaign_arc": "The Great Work - Seven stages of spiritual initiation",
            "session_structure": "Each session focuses on one aspect of mystical development",
            "character_growth": "Characters advance through actual spiritual understanding, not just XP",
            "story_themes": ["Self-discovery", "Shadow work", "Divine connection", "Service to others"],
            "recurring_challenges": ["Ego resistance", "Spiritual bypassing", "Integration difficulties"],
            "victory_conditions": "Campaign succeeds when characters achieve genuine wisdom and can help others"
        }
        
        return framework
    
    def _generate_experience_features(self, experience_type, concepts):
        """Generate features for interactive experience"""
        features = {
            "meditation_app": [
                "Guided meditations based on book teachings",
                "Binaural beats tuned to mystical frequencies",
                "Progress tracking through wisdom milestones",
                "Daily oracle card pulls with interpretations",
                "Community sharing of insights and experiences"
            ],
            "puzzle_game": [
                "Sacred geometry puzzle solving",
                "Symbol matching based on mystical correspondences",
                "Progressive difficulty matching spiritual development",
                "Educational content about symbols and meanings",
                "Achievement system for mastering concepts"
            ]
        }
        
        return features.get(experience_type, features["meditation_app"])
    
    def _generate_user_journey(self, passage_data, concepts):
        """Generate user journey through the experience"""
        journey = {
            "onboarding": "Brief introduction to the source wisdom and spiritual context",
            "initial_engagement": "Simple, accessible entry point into the mystical concepts",
            "skill_development": "Progressive learning system that builds genuine understanding",
            "community_integration": "Connect with others on similar spiritual paths",
            "mastery": "Advanced practices for deepened spiritual development",
            "teaching": "Opportunity to share wisdom with newer practitioners"
        }
        
        return journey
    
    def _generate_gamification_elements(self, concepts):
        """Generate gamification that supports genuine spiritual growth"""
        elements = {
            "wisdom_points": "Earned through genuine insight and understanding, not repetitive actions",
            "initiation_levels": "Mark actual spiritual development milestones",
            "sacred_achievements": "Recognize breakthroughs in consciousness and compassion",
            "mentor_system": "Advanced users can guide newcomers",
            "wisdom_sharing": "Points for helpful contributions to community",
            "meditation_streaks": "Encourage consistent practice without addiction"
        }
        
        return elements
    
    # Additional helper methods...
    def _generate_win_conditions(self, concepts):
        return ["First to collect 7 Wisdom cards", "Complete a Sacred Marriage ritual", "Achieve perfect balance of all elements"]
    
    def _generate_expansion_ideas(self, concepts, tradition):
        return [f"{tradition.title()} Advanced Mysteries", "Shadow Work Expansion", "Celestial Influences Set"]
    
    def _generate_art_style(self, tradition):
        return f"Art Nouveau meets {tradition} symbolism, using your existing artwork as inspiration"
    
    def _generate_rpg_name(self, passage_data, concepts):
        return f"The {passage_data.get('book_title', 'Mystical').split()[0]} Mysteries RPG"
    
    def _generate_core_mechanics(self, tradition):
        return f"d100 system modified for spiritual insight over physical combat"
    
    def _generate_character_system(self, tradition):
        return self.character_archetypes
    
    def _generate_sample_adventure(self, passage_data, concepts):
        return {"title": "The First Initiation", "description": "Characters must face their shadows to advance"}
    
    def _generate_mystical_creatures(self, tradition):
        return ["Shadow Aspect", "Divine Messenger", "Ego Guardian", "Wisdom Keeper"]
    
    def _generate_mystical_artifacts(self, concepts, tradition):
        return ["Sacred Text Fragment", "Philosopher's Stone Shard", "Divine Light Crystal"]
    
    def _generate_gm_tools(self, tradition):
        return ["Wisdom Oracle", "Challenge Generator", "Spiritual Insight Tables"]
    
    def _generate_experience_name(self, passage_data, concepts):
        return f"Sacred {concepts.get('actions', ['Journey'])[0].title()} App"
    
    def _generate_content_structure(self, passage_data, concepts):
        return {"modules": 7, "lessons_per_module": 8, "practice_time": "15-45 minutes"}
    
    def _generate_monetization_strategy(self):
        return {"model": "Freemium with ethical in-app purchases", "focus": "Supporting genuine spiritual development"}
    
    def _generate_tech_requirements(self, experience_type):
        return {"minimum_os": "iOS 12+, Android 8+", "features": ["audio playback", "progress tracking"]}

if __name__ == "__main__":
    engine = GameEngine()
    
    # Test game generation
    test_passage = {
        'content': 'The path of initiation requires facing the shadow, integrating the rejected aspects of self, and emerging transformed. Each challenge becomes a teacher, each obstacle a doorway to greater wisdom.',
        'book_title': 'The Initiate\'s Journey',
        'author': 'C.G. Jung',
        'tradition': 'jungian'
    }
    
    card_game = engine.generate_card_game(test_passage)
    rpg_system = engine.generate_rpg_system(test_passage)
    
    print("=== CARD GAME ===")
    print(json.dumps(card_game, indent=2))
    print("\n=== RPG SYSTEM ===")
    print(json.dumps(rpg_system, indent=2))