#!/usr/bin/env python3
"""
Interactive Chapter Generator
Transforms book passages into branching narrative chapters for your interactive book
Uses your Codex schema to create immersive experiences
"""

import sqlite3
import random
import json
from pathlib import Path

class ChapterEngine:
    def __init__(self, db_path="../books.db"):
        self.db_path = db_path
        
        # Chapter archetypes based on your Codex structure
        self.chapter_archetypes = {
            "initiation": {
                "themes": ["beginning", "awakening", "first steps", "revelation"],
                "mood": "mysterious, welcoming",
                "colors": ["#FFFFFF", "#FFD700", "#E6E6FA"],
                "music_keys": ["C", "G", "F"],
                "sacred_geometry": ["circle", "spiral", "triangle"]
            },
            "trial": {
                "themes": ["challenge", "shadow work", "confrontation", "testing"],
                "mood": "intense, transformative", 
                "colors": ["#7A2E2A", "#0B0E14", "#6E45A3"],
                "music_keys": ["D minor", "A minor", "F# minor"],
                "sacred_geometry": ["square", "cross", "pentagram"]
            },
            "wisdom": {
                "themes": ["teaching", "revelation", "understanding", "integration"],
                "mood": "luminous, profound",
                "colors": ["#C6A664", "#1E5F4F", "#EDE6D5"],
                "music_keys": ["D major", "A major", "E major"],
                "sacred_geometry": ["hexagram", "merkaba", "flower of life"]
            },
            "synthesis": {
                "themes": ["unity", "completion", "mastery", "transcendence"],
                "mood": "transcendent, unified",
                "colors": ["#14192B", "#C6A664", "#FFFFFF"],
                "music_keys": ["C major", "G major", "F# major"],
                "sacred_geometry": ["sphere", "infinity", "ouroboros"]
            }
        }
    
    def generate_chapter_from_passage(self, passage_data, archetype_type="wisdom"):
        """Transform a book passage into an interactive chapter"""
        
        archetype = self.chapter_archetypes[archetype_type]
        
        # Extract core concepts from the passage
        concepts = self._extract_concepts(passage_data['content'])
        
        # Generate chapter structure
        chapter = {
            "title": self._generate_chapter_title(passage_data, concepts),
            "archetype": archetype_type,
            "source": {
                "book": passage_data['book_title'],
                "author": passage_data['author'],
                "page": passage_data['page']
            },
            "summary": self._create_chapter_summary(passage_data['content'], concepts),
            "scenes": self._generate_scenes(passage_data['content'], archetype, concepts),
            "sensory_design": {
                "colors": {
                    "primary": random.choice(archetype["colors"]),
                    "secondary": random.choice(archetype["colors"]),
                    "accent": random.choice(archetype["colors"])
                },
                "music": {
                    "key": random.choice(archetype["music_keys"]),
                    "tempo": random.choice([72, 96, 108, 120]),
                    "mood": archetype["mood"]
                },
                "geometry": random.choice(archetype["sacred_geometry"])
            },
            "interactive_elements": self._generate_interactions(concepts),
            "branch_options": self._generate_branches(concepts)
        }
        
        return chapter
    
    def _extract_concepts(self, text):
        """Extract key mystical/esoteric concepts from text"""
        concept_patterns = {
            "archetypes": ["fool", "magician", "high priestess", "emperor", "hierophant"],
            "elements": ["fire", "water", "air", "earth", "spirit"],
            "planets": ["sun", "moon", "mercury", "venus", "mars", "jupiter", "saturn"],
            "chakras": ["root", "sacral", "solar", "heart", "throat", "third eye", "crown"],
            "kabbalah": ["kether", "chokmah", "binah", "chesed", "geburah", "tiphareth"],
            "alchemy": ["solve", "coagula", "prima materia", "philosopher's stone", "nigredo"]
        }
        
        found_concepts = {}
        text_lower = text.lower()
        
        for category, terms in concept_patterns.items():
            matches = [term for term in terms if term in text_lower]
            if matches:
                found_concepts[category] = matches
        
        return found_concepts
    
    def _generate_chapter_title(self, passage_data, concepts):
        """Generate mystical chapter title"""
        title_templates = [
            "The {concept} of {source}",
            "{concept}: A Teaching from {author}",
            "In the Realm of {concept}",
            "The Sacred {concept}",
            "{concept} - {source} Mysteries"
        ]
        
        # Pick a key concept for the title
        if concepts:
            category = random.choice(list(concepts.keys()))
            concept = random.choice(concepts[category])
        else:
            concept = "Wisdom"
        
        template = random.choice(title_templates)
        return template.format(
            concept=concept.title(),
            source=passage_data['book_title'].split()[0] if passage_data['book_title'] else "Ancient",
            author=passage_data['author'].split()[0] if passage_data['author'] != "Unknown" else "Sage"
        )
    
    def _create_chapter_summary(self, content, concepts):
        """Create a mystical summary of the chapter's wisdom"""
        # Extract first few sentences as base
        sentences = content.split('.')[:3]
        base_text = '. '.join(sentences).strip()
        
        if len(base_text) > 250:
            base_text = base_text[:247] + "..."
        
        return f"Ancient wisdom unfolds as {base_text} Here, seeker, you will encounter the mysteries of {', '.join(random.sample(list(concepts.keys()), min(2, len(concepts))))} and discover the hidden teachings that await your understanding."
    
    def _generate_scenes(self, content, archetype, concepts):
        """Generate 3-5 interactive scenes from the passage"""
        scenes = []
        
        # Split content into meaningful chunks
        sentences = [s.strip() for s in content.split('.') if len(s.strip()) > 30]
        
        scene_count = min(5, max(3, len(sentences) // 3))
        
        for i in range(scene_count):
            scene_text = sentences[i * len(sentences) // scene_count] if i * len(sentences) // scene_count < len(sentences) else sentences[-1]
            
            scene = {
                "title": f"Scene {i+1}: {self._generate_scene_title(scene_text, concepts)}",
                "action": self._generate_scene_action(scene_text, archetype),
                "motifs": self._generate_scene_motifs(concepts),
                "choices": self._generate_scene_choices(concepts)
            }
            scenes.append(scene)
        
        return scenes
    
    def _generate_scene_title(self, text, concepts):
        """Generate mystical scene title"""
        titles = [
            "The Threshold of Understanding",
            "Whispers of Ancient Knowledge",
            "The Sacred Revelation",
            "Mysteries Unveiled",
            "The Inner Sanctum",
            "Echoes of Wisdom",
            "The Luminous Path",
            "Sacred Geometry Awakens"
        ]
        return random.choice(titles)
    
    def _generate_scene_action(self, text, archetype):
        """Generate what the reader does in this scene"""
        actions = {
            "initiation": [
                "You stand at the threshold, feeling the ancient wisdom calling to your soul...",
                "The sacred text glows with inner light as you approach...",
                "Symbols begin to form in your mind's eye as understanding dawns..."
            ],
            "trial": [
                "You must face the shadows within as the teaching challenges your assumptions...",
                "The path splits before you - which aspect of truth will you embrace?",
                "Inner resistance arises - how will you transform this limitation?"
            ],
            "wisdom": [
                "You sit in contemplation as the deeper meaning reveals itself...",
                "The teacher's words resonate through layers of your consciousness...",
                "Sacred geometry forms in your awareness as truth crystallizes..."
            ],
            "synthesis": [
                "All the pieces come together in a moment of profound integration...",
                "You embody the teaching, becoming one with its essence...",
                "The wisdom transforms from knowledge into living truth..."
            ]
        }
        
        return random.choice(actions[archetype])
    
    def _generate_scene_motifs(self, concepts):
        """Generate mystical motifs for the scene"""
        motifs = []
        
        if concepts:
            for category, items in concepts.items():
                motif = f"{category.title()}: {', '.join(items)}"
                motifs.append(motif)
        
        return motifs if motifs else ["Sacred symbols dance in the etheric light"]
    
    def _generate_scene_choices(self, concepts):
        """Generate mystical choices for scene interaction"""
        choice_templates = [
            "Meditate deeply on the {concept}",
            "Invoke the energy of {concept}",
            "Draw the sacred {concept} in light",
            "Chant the name of {concept}",
            "Visualize yourself as {concept}"
        ]
        
        choices = []
        if concepts:
            for category, items in list(concepts.items())[:2]:
                for item in items[:2]:
                    template = random.choice(choice_templates)
                    choice = template.format(concept=item)
                    choices.append(choice)
        
        return choices if choices else ["Continue in silent contemplation", "Ask for deeper understanding"]
    
    def _generate_interactions(self, concepts):
        """Generate interactive elements for the chapter"""
        interactions = {
            "meditation": f"Guided meditation on {random.choice(list(concepts.keys())) if concepts else 'wisdom'}",
            "visualization": "Sacred geometry visualization exercise",
            "reflection": "Journal prompts for integration",
            "ritual": "Simple ceremonial practice",
            "divination": "Oracle card or symbol drawing"
        }
        
        return random.sample(list(interactions.items()), 3)
    
    def _generate_branches(self, concepts):
        """Generate branch options to other chapters/nodes"""
        if not concepts:
            return ["Continue to Next Teaching", "Return to Index"]
        
        branches = []
        for category in list(concepts.keys())[:3]:
            branches.append(f"Explore more about {category.title()}")
        
        branches.append("Integrate this wisdom")
        branches.append("Seek related teachings")
        
        return branches
    
    def create_chapter_from_book_search(self, search_term, tradition=None):
        """Search books and create chapter from matching passage"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        query = '''
            SELECT p.content, p.page_number, p.importance_score, b.title, b.author, b.tradition
            FROM passages p
            JOIN books b ON p.book_id = b.id
            WHERE p.content LIKE ?
        '''
        params = [f'%{search_term}%']
        
        if tradition:
            query += ' AND b.tradition = ?'
            params.append(tradition)
        
        query += ' ORDER BY p.importance_score DESC LIMIT 1'
        
        cursor.execute(query, params)
        result = cursor.fetchone()
        conn.close()
        
        if result:
            passage_data = {
                'content': result[0],
                'page': result[1],
                'score': result[2],
                'book_title': result[3],
                'author': result[4],
                'tradition': result[5]
            }
            
            # Choose archetype based on tradition
            archetype_map = {
                'hermetic': 'wisdom',
                'thelemic': 'trial',
                'jungian': 'synthesis',
                'kabbalah': 'initiation'
            }
            
            archetype = archetype_map.get(passage_data['tradition'], 'wisdom')
            
            return self.generate_chapter_from_passage(passage_data, archetype)
        
        return None

if __name__ == "__main__":
    engine = ChapterEngine()
    
    # Example usage
    test_passage = {
        'content': 'The fool stands at the precipice of the unknown, ready to take the first step into mystery. In his hand he carries the white rose of pure intention, while the abyss below represents the unconscious depths he must explore.',
        'page': 23,
        'score': 8.5,
        'book_title': 'The Sacred Tarot',
        'author': 'Mystical Teacher',
        'tradition': 'hermetic'
    }
    
    chapter = engine.generate_chapter_from_passage(test_passage, 'initiation')
    
    print("=== GENERATED CHAPTER ===")
    print(json.dumps(chapter, indent=2))