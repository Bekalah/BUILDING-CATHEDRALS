#!/usr/bin/env python3
"""
Codex Node Generator
Creates complete Cathedral of Circuits nodes from book passages
Auto-fills all node properties with authentic source material
"""

import sqlite3
import json
import random
import re
from datetime import datetime

class NodeEngine:
    def __init__(self, db_path="../books.db"):
        self.db_path = db_path
        
        # Codex node template based on your schema
        self.node_template = {
            "id": None,
            "name": "",
            "lock": True,
            "ego": "",
            "shem": "",
            "goet": "",
            "gods": [],
            "godd": [],
            "chakra": "",
            "planet": "",
            "zodiac": "",
            "element": "",
            "solid": "",
            "sf": "",
            "music": {
                "rn": "",
                "sc": "",
                "bpm": 96,
                "inst": []
            },
            "col": {
                "p": "",
                "s": "",
                "a": ""
            },
            "geo": "",
            "art": "",
            "fn": "",
            "heal": {
                "nd": True,
                "ptsd": True,
                "v": "",
                "snd": ""
            },
            "tags": []
        }
        
        # Reference tables for auto-population
        self.shem_names = [
            "Vehuiah", "Jeliel", "Sitael", "Elemiah", "Mahasiah", "Lelahel",
            "Achaiah", "Cahethel", "Haziel", "Aladiah", "Lauviah", "Hahaiah"
        ]
        
        self.goet_names = [
            "Bael", "Agares", "Vassago", "Samigina", "Marbas", "Valefor",
            "Amon", "Barbatos", "Paimon", "Buer", "Gusion", "Sitri"
        ]
        
        self.planetary_correspondences = {
            "sun": {"chakra": "Solar Plexus", "element": "Fire", "sf": "528 Hz", "music_key": "C"},
            "moon": {"chakra": "Sacral", "element": "Water", "sf": "396 Hz", "music_key": "D"},
            "mercury": {"chakra": "Throat", "element": "Air", "sf": "741 Hz", "music_key": "G"},
            "venus": {"chakra": "Heart", "element": "Earth", "sf": "639 Hz", "music_key": "F"},
            "mars": {"chakra": "Root", "element": "Fire", "sf": "417 Hz", "music_key": "E"},
            "jupiter": {"chakra": "Crown", "element": "Air", "sf": "963 Hz", "music_key": "B"},
            "saturn": {"chakra": "Third Eye", "element": "Earth", "sf": "852 Hz", "music_key": "A"}
        }
        
        self.color_palettes = {
            "fire": {"p": "#FF4500", "s": "#FFD700", "a": "#FF6347"},
            "water": {"p": "#4682B4", "s": "#87CEEB", "a": "#20B2AA"},
            "air": {"p": "#FFE4B5", "s": "#F0E68C", "a": "#FFFFE0"},
            "earth": {"p": "#8B4513", "s": "#D2691E", "a": "#CD853F"},
            "spirit": {"p": "#9370DB", "s": "#DDA0DD", "a": "#E6E6FA"}
        }
        
        self.geometric_forms = [
            "Sphere", "Cube", "Tetrahedron", "Octahedron", "Icosahedron",
            "Dodecahedron", "Torus", "Merkaba", "Spiral", "Mandala"
        ]
    
    def generate_node_from_passage(self, passage_data, node_id=None):
        """Generate a complete Codex node from book passage"""
        
        # Create base node
        node = self.node_template.copy()
        node["music"] = self.node_template["music"].copy()
        node["col"] = self.node_template["col"].copy()
        node["heal"] = self.node_template["heal"].copy()
        
        # Set ID
        node["id"] = node_id or self._generate_node_id()
        
        # Extract core information from passage
        concepts = self._extract_mystical_concepts(passage_data['content'])
        
        # Generate name based on content
        node["name"] = self._generate_node_name(passage_data, concepts)
        
        # Set ego (core archetype)
        node["ego"] = self._determine_ego_archetype(passage_data['content'], concepts)
        
        # Assign Shem and Goetic pair
        shem_goet_pair = self._assign_shem_goet_pair()
        node["shem"] = shem_goet_pair["shem"]
        node["goet"] = shem_goet_pair["goet"]
        
        # Assign deities based on tradition
        node["gods"], node["godd"] = self._assign_deities(passage_data.get('tradition', ''), concepts)
        
        # Determine planetary correspondence
        planet = self._determine_planet(concepts, passage_data['content'])
        node["planet"] = planet
        
        # Set corresponding attributes based on planet
        if planet.lower() in self.planetary_correspondences:
            corr = self.planetary_correspondences[planet.lower()]
            node["chakra"] = corr["chakra"]
            node["element"] = corr["element"]
            node["sf"] = corr["sf"]
            node["music"]["rn"] = corr["music_key"]
        
        # Set additional musical properties
        node["music"]["sc"] = random.choice(["Ionian", "Dorian", "Phrygian", "Lydian", "Mixolydian"])
        node["music"]["bpm"] = random.choice([72, 84, 96, 108, 120])
        node["music"]["inst"] = self._select_instruments(concepts, node["element"])
        
        # Set colors based on element
        if node["element"]:
            element_lower = node["element"].lower()
            if element_lower in self.color_palettes:
                node["col"] = self.color_palettes[element_lower]
        
        # Set zodiac sign
        node["zodiac"] = self._determine_zodiac(planet, concepts)
        
        # Set geometric form
        node["solid"] = random.choice(self.geometric_forms)
        
        # Set geometric description
        node["geo"] = self._generate_geometric_description(node["solid"], concepts)
        
        # Set art reference (use actual art from your collection)
        node["art"] = self._select_art_reference(concepts, passage_data.get('tradition', ''))
        
        # Set function/purpose
        node["fn"] = self._generate_function(passage_data['content'], concepts)
        
        # Set healing properties
        node["heal"]["v"] = self._generate_healing_visual(concepts)
        node["heal"]["snd"] = self._generate_healing_sound(node["music"], concepts)
        
        # Generate tags
        node["tags"] = self._generate_tags(concepts, passage_data.get('tradition', ''), node["element"])
        
        # Add source metadata
        node["_source"] = {
            "book": passage_data.get('book_title', ''),
            "author": passage_data.get('author', ''),
            "page": passage_data.get('page', ''),
            "passage_excerpt": passage_data['content'][:200] + "..." if len(passage_data['content']) > 200 else passage_data['content']
        }
        
        return node
    
    def _generate_node_id(self):
        """Generate unique node ID"""
        # Could be sequential or based on timestamp
        return int(datetime.now().timestamp() * 1000) % 9999
    
    def _extract_mystical_concepts(self, text):
        """Extract esoteric concepts from text"""
        concepts = {}
        text_lower = text.lower()
        
        # Tarot archetypes
        tarot_archetypes = ["fool", "magician", "high priestess", "empress", "emperor", 
                           "hierophant", "lovers", "chariot", "hermit", "wheel", "justice"]
        found_archetypes = [arch for arch in tarot_archetypes if arch in text_lower]
        if found_archetypes:
            concepts["tarot"] = found_archetypes
        
        # Elements
        elements = ["fire", "water", "air", "earth", "spirit", "ether"]
        found_elements = [elem for elem in elements if elem in text_lower]
        if found_elements:
            concepts["elements"] = found_elements
        
        # Planets
        planets = ["sun", "moon", "mercury", "venus", "mars", "jupiter", "saturn"]
        found_planets = [planet for planet in planets if planet in text_lower]
        if found_planets:
            concepts["planets"] = found_planets
        
        # Chakras
        chakras = ["root", "sacral", "solar", "heart", "throat", "third eye", "crown"]
        found_chakras = [chakra for chakra in chakras if chakra in text_lower]
        if found_chakras:
            concepts["chakras"] = found_chakras
        
        # Alchemical terms
        alchemy = ["solve", "coagula", "prima materia", "philosopher's stone", "nigredo", "albedo", "rubedo"]
        found_alchemy = [term for term in alchemy if term in text_lower]
        if found_alchemy:
            concepts["alchemy"] = found_alchemy
        
        return concepts
    
    def _generate_node_name(self, passage_data, concepts):
        """Generate mystical node name"""
        # Use first significant concept or create from book title
        if concepts:
            category = list(concepts.keys())[0]
            concept = concepts[category][0]
            return f"Node of {concept.title()}"
        
        # Fallback to book-based name
        book_words = passage_data.get('book_title', 'Mystery').split()[:2]
        return f"{''.join(book_words)} Node"
    
    def _determine_ego_archetype(self, text, concepts):
        """Determine the core ego archetype"""
        archetypes = [
            "seeker", "teacher", "healer", "warrior", "sage", "mystic",
            "initiate", "adept", "guardian", "transformer", "creator", "destroyer"
        ]
        
        # Logic based on content analysis
        text_lower = text.lower()
        
        if any(word in text_lower for word in ["teach", "learn", "wisdom", "knowledge"]):
            return "sage"
        elif any(word in text_lower for word in ["heal", "medicine", "cure", "therapy"]):
            return "healer"
        elif any(word in text_lower for word in ["fight", "battle", "strength", "power"]):
            return "warrior"
        elif any(word in text_lower for word in ["seek", "search", "quest", "journey"]):
            return "seeker"
        elif any(word in text_lower for word in ["create", "make", "build", "manifest"]):
            return "creator"
        else:
            return random.choice(archetypes)
    
    def _assign_shem_goet_pair(self):
        """Assign paired Shem and Goetic spirits"""
        # In your system, these are paired - pick matching indices
        index = random.randint(0, len(self.shem_names) - 1)
        return {
            "shem": self.shem_names[index],
            "goet": self.goet_names[index]
        }
    
    def _assign_deities(self, tradition, concepts):
        """Assign gods and goddesses based on tradition and concepts"""
        deity_sets = {
            "hermetic": {
                "gods": [{"n": "Hermes Trismegistus", "c": "Hermetic"}, {"n": "Thoth", "c": "Egyptian"}],
                "goddesses": [{"n": "Sophia", "c": "Gnostic"}, {"n": "Isis", "c": "Egyptian"}]
            },
            "thelemic": {
                "gods": [{"n": "Ra-Hoor-Khuit", "c": "Thelemic"}, {"n": "Horus", "c": "Egyptian"}],
                "goddesses": [{"n": "Nuit", "c": "Thelemic"}, {"n": "Babalon", "c": "Thelemic"}]
            },
            "jungian": {
                "gods": [{"n": "Mercurius", "c": "Alchemical"}, {"n": "Wotan", "c": "Germanic"}],
                "goddesses": [{"n": "Anima", "c": "Jungian"}, {"n": "Sophia", "c": "Gnostic"}]
            },
            "kabbalah": {
                "gods": [{"n": "YHVH", "c": "Hebrew"}, {"n": "Adonai", "c": "Hebrew"}],
                "goddesses": [{"n": "Shekinah", "c": "Hebrew"}, {"n": "Sophia", "c": "Gnostic"}]
            }
        }
        
        if tradition in deity_sets:
            return deity_sets[tradition]["gods"], deity_sets[tradition]["goddesses"]
        else:
            # Default hermetic
            return deity_sets["hermetic"]["gods"], deity_sets["hermetic"]["goddesses"]
    
    def _determine_planet(self, concepts, text):
        """Determine ruling planet"""
        if "planets" in concepts:
            return concepts["planets"][0].title()
        
        # Analyze text for planetary keywords
        planetary_keywords = {
            "Sun": ["light", "gold", "leadership", "consciousness"],
            "Moon": ["intuition", "dreams", "emotion", "cycles"],
            "Mercury": ["communication", "wisdom", "learning", "travel"],
            "Venus": ["love", "beauty", "harmony", "art"],
            "Mars": ["action", "courage", "conflict", "energy"],
            "Jupiter": ["expansion", "philosophy", "teaching", "abundance"],
            "Saturn": ["limitation", "structure", "discipline", "time"]
        }
        
        text_lower = text.lower()
        planet_scores = {}
        
        for planet, keywords in planetary_keywords.items():
            score = sum(1 for keyword in keywords if keyword in text_lower)
            if score > 0:
                planet_scores[planet] = score
        
        if planet_scores:
            return max(planet_scores.items(), key=lambda x: x[1])[0]
        
        return random.choice(list(planetary_keywords.keys()))
    
    def _determine_zodiac(self, planet, concepts):
        """Determine zodiac sign based on planet and concepts"""
        planetary_rulerships = {
            "Sun": ["Leo"],
            "Moon": ["Cancer"],
            "Mercury": ["Gemini", "Virgo"],
            "Venus": ["Taurus", "Libra"],
            "Mars": ["Aries", "Scorpio"],
            "Jupiter": ["Sagittarius", "Pisces"],
            "Saturn": ["Capricorn", "Aquarius"]
        }
        
        if planet in planetary_rulerships:
            return random.choice(planetary_rulerships[planet])
        
        return "Leo"  # Default
    
    def _select_instruments(self, concepts, element):
        """Select musical instruments based on concepts and element"""
        instrument_sets = {
            "Fire": ["Trumpet", "Brass Ensemble", "Electric Guitar"],
            "Water": ["Flute", "Ocean Sounds", "Singing Bowls"],
            "Air": ["Wind Chimes", "Harp", "Violin"],
            "Earth": ["Drums", "Didgeridoo", "Deep Bass"],
            "Spirit": ["Crystal Bowls", "Choir", "Bells"]
        }
        
        if element in instrument_sets:
            return random.sample(instrument_sets[element], 2)
        
        return ["Synthesizer", "Ambient Pad"]
    
    def _generate_geometric_description(self, solid, concepts):
        """Generate geometric pattern description"""
        descriptions = {
            "Sphere": "Perfect unity spiral emanating from center point",
            "Cube": "Crystalline matrix of earthly manifestation",
            "Tetrahedron": "Fire triangle ascending through dimensions",
            "Octahedron": "Dual pyramid gateway between worlds",
            "Merkaba": "Light vehicle of consciousness rotation"
        }
        
        return descriptions.get(solid, f"Sacred {solid.lower()} pattern of infinite recursion")
    
    def _select_art_reference(self, concepts, tradition):
        """Select art reference from your actual collection"""
        # Map to your actual art files
        art_mappings = {
            "hermetic": "LEMKE_FINAL_WALLPICTURE.jpg",
            "healing": "HealingArtRlemke11.jpg", 
            "mystical": "MYSOULCOLORS.jpg",
            "emotional": "LEMKE_BATCH1_emotion.jpg",
            "spiritual": "mysoulsings.jpg",
            "transformative": "Rebecca_Chimera.jpg"
        }
        
        # Try to match tradition first
        if tradition in art_mappings:
            return art_mappings[tradition]
        
        # Match by concept
        for category, items in concepts.items():
            if category in art_mappings:
                return art_mappings[category]
        
        # Default
        return "LEMKE_SOFTLIGHT.jpg"
    
    def _generate_function(self, text, concepts):
        """Generate node function/purpose"""
        functions = [
            "Activate conscious awareness of {concept}",
            "Integrate {concept} wisdom into daily practice",
            "Channel {concept} energy for healing transformation",
            "Establish sacred connection with {concept}",
            "Embody the teaching of {concept}"
        ]
        
        if concepts:
            category = list(concepts.keys())[0]
            concept = concepts[category][0]
            template = random.choice(functions)
            return template.format(concept=concept)
        
        return "Awaken deeper understanding and integration"
    
    def _generate_healing_visual(self, concepts):
        """Generate healing visualization"""
        visuals = [
            "golden light spiral",
            "crystalline energy waves",
            "sacred geometry mandala",
            "luminous healing presence",
            "rainbow chakra activation"
        ]
        return random.choice(visuals)
    
    def _generate_healing_sound(self, music_data, concepts):
        """Generate healing sound description"""
        key = music_data.get("rn", "C")
        freq = music_data.get("sf", "528 Hz")
        
        return f"harmonic resonance in {key} at {freq}"
    
    def _generate_tags(self, concepts, tradition, element):
        """Generate relevant tags"""
        tags = []
        
        if tradition:
            tags.append(tradition.title())
        
        if element:
            tags.append(element.title())
        
        for category, items in concepts.items():
            tags.extend([item.title() for item in items[:2]])
        
        tags.extend(["Wisdom", "Transformation", "Sacred"])
        
        return list(set(tags))  # Remove duplicates
    
    def create_multiple_nodes_from_search(self, search_term, count=5, tradition=None):
        """Create multiple nodes from search results"""
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
        
        query += ' ORDER BY p.importance_score DESC LIMIT ?'
        params.append(count)
        
        cursor.execute(query, params)
        results = cursor.fetchall()
        conn.close()
        
        nodes = []
        for i, result in enumerate(results):
            passage_data = {
                'content': result[0],
                'page': result[1], 
                'score': result[2],
                'book_title': result[3],
                'author': result[4],
                'tradition': result[5]
            }
            
            node = self.generate_node_from_passage(passage_data, node_id=i+1)
            nodes.append(node)
        
        return nodes

if __name__ == "__main__":
    engine = NodeEngine()
    
    # Test with sample passage
    test_passage = {
        'content': 'The hermetic principle of correspondence states that as above, so below. This fundamental law reveals that patterns repeat across all levels of existence, from the cosmic to the atomic.',
        'page': 42,
        'score': 9.2,
        'book_title': 'The Emerald Tablet',
        'author': 'Hermes Trismegistus',
        'tradition': 'hermetic'
    }
    
    node = engine.generate_node_from_passage(test_passage)
    
    print("=== GENERATED CODEX NODE ===")
    print(json.dumps(node, indent=2))