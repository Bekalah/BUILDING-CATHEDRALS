#!/usr/bin/env python3
"""
Fashion & Art Generator
Transforms book wisdom into fashion designs, art concepts, and visual expressions
Uses your actual artwork and creates mystical fashion collections
"""

import sqlite3
import json
import random
from pathlib import Path

class FashionArtEngine:
    def __init__(self, db_path="../books.db"):
        self.db_path = db_path
        
        # Fashion design elements based on mystical traditions
        self.fashion_elements = {
            "hermetic": {
                "colors": ["#C6A664", "#0B0E14", "#EDE6D5"],  # Antique gold, obsidian, bone
                "textures": ["silk", "velvet", "leather", "metallic mesh"],
                "symbols": ["caduceus", "ouroboros", "emerald tablet", "alchemical sigils"],
                "silhouettes": ["flowing robes", "structured blazers", "asymmetric cuts"],
                "accessories": ["sacred geometry jewelry", "crystal pendants", "sigil rings"]
            },
            "thelemic": {
                "colors": ["#7A2E2A", "#FFD700", "#000000"],  # Blood rust, gold, black
                "textures": ["leather", "latex", "chainmail", "sheer fabric"],
                "symbols": ["unicursal hexagram", "rose cross", "ankh", "eye of horus"],
                "silhouettes": ["ceremonial robes", "military-inspired", "gothic cuts"],
                "accessories": ["pentagram jewelry", "ritual daggers", "ceremonial masks"]
            },
            "healing": {
                "colors": ["#1E5F4F", "#87CEEB", "#E6E6FA"],  # Emerald veil, sky blue, lavender
                "textures": ["organic cotton", "linen", "bamboo", "crystal-infused fabric"],
                "symbols": ["chakra symbols", "lotus flowers", "healing hands", "mandala"],
                "silhouettes": ["flowing meditation wear", "yoga-inspired", "wrap styles"],
                "accessories": ["crystal jewelry", "healing stones", "energy bracelets"]
            },
            "mystical": {
                "colors": ["#6E45A3", "#C6A664", "#14192B"],  # Violet, gold, indigo night
                "textures": ["iridescent fabric", "gossamer", "star-pattern", "holographic"],
                "symbols": ["pentagram", "tree of life", "cosmic symbols", "star maps"],
                "silhouettes": ["celestial gowns", "star-inspired", "flowing capes"],
                "accessories": ["constellation jewelry", "tarot card prints", "cosmic crowns"]
            }
        }
        
        # Art concept templates
        self.art_concepts = {
            "digital_art": {
                "mediums": ["digital painting", "3D rendering", "AI-assisted creation", "VR sculpture"],
                "styles": ["visionary art", "sacred geometry", "fractal art", "neo-mystical"],
                "color_schemes": ["cosmic purple", "alchemical gold", "healing green", "shadow black"]
            },
            "traditional_art": {
                "mediums": ["oil painting", "watercolor", "mixed media", "sculpture"],
                "styles": ["symbolic realism", "abstract mysticism", "art nouveau revival", "gothic romanticism"],
                "techniques": ["layered symbolism", "golden ratio composition", "mandala structure"]
            },
            "interactive_art": {
                "formats": ["augmented reality", "interactive installation", "responsive sculpture", "biometric art"],
                "interactions": ["breath-responsive", "heart-rate-triggered", "gesture-activated", "sound-reactive"]
            }
        }
    
    def generate_fashion_collection(self, passage_data, tradition_override=None):
        """Generate a complete mystical fashion collection from book passage"""
        
        tradition = tradition_override or passage_data.get('tradition', 'mystical')
        
        # Get tradition-specific elements
        elements = self.fashion_elements.get(tradition, self.fashion_elements['mystical'])
        
        # Analyze passage for inspiration
        concepts = self._extract_fashion_concepts(passage_data['content'])
        
        collection = {
            "collection_name": self._generate_collection_name(passage_data, concepts),
            "inspiration": {
                "source_text": passage_data['content'][:300] + "..." if len(passage_data['content']) > 300 else passage_data['content'],
                "book": passage_data.get('book_title', ''),
                "author": passage_data.get('author', ''),
                "tradition": tradition
            },
            "color_palette": {
                "primary": elements["colors"][0],
                "secondary": elements["colors"][1], 
                "accent": elements["colors"][2] if len(elements["colors"]) > 2 else elements["colors"][0]
            },
            "pieces": self._generate_fashion_pieces(elements, concepts),
            "styling_notes": self._generate_styling_notes(tradition, concepts),
            "mystical_properties": self._generate_mystical_properties(concepts),
            "photoshoot_concept": self._generate_photoshoot_concept(tradition, concepts),
            "artwork_inspiration": self._select_artwork_inspiration(tradition, concepts)
        }
        
        return collection
    
    def generate_art_concept(self, passage_data, art_type="digital_art"):
        """Generate art concept from book passage"""
        
        concepts = self._extract_visual_concepts(passage_data['content'])
        tradition = passage_data.get('tradition', 'mystical')
        
        art_data = self.art_concepts.get(art_type, self.art_concepts['digital_art'])
        
        concept = {
            "title": self._generate_art_title(passage_data, concepts),
            "medium": random.choice(art_data["mediums"]),
            "style": random.choice(art_data.get("styles", ["contemporary mystical"])),
            "inspiration": {
                "source_passage": passage_data['content'][:200] + "...",
                "book": passage_data.get('book_title', ''),
                "tradition": tradition
            },
            "visual_elements": self._generate_visual_elements(concepts, tradition),
            "color_story": self._generate_color_story(tradition, concepts),
            "symbolic_meaning": self._generate_symbolic_meaning(concepts),
            "technical_specs": self._generate_technical_specs(art_type),
            "series_potential": self._generate_series_ideas(concepts),
            "existing_art_reference": self._reference_existing_art(tradition, concepts)
        }
        
        return concept
    
    def _extract_fashion_concepts(self, text):
        """Extract fashion-relevant concepts from text"""
        concepts = {}
        text_lower = text.lower()
        
        # Fabric/texture inspiration
        texture_words = ["silk", "velvet", "rough", "smooth", "flowing", "structured", "soft", "hard"]
        found_textures = [word for word in texture_words if word in text_lower]
        if found_textures:
            concepts["textures"] = found_textures
        
        # Color inspiration
        color_words = ["gold", "silver", "black", "white", "red", "blue", "green", "purple", "violet"]
        found_colors = [color for color in color_words if color in text_lower]
        if found_colors:
            concepts["colors"] = found_colors
        
        # Movement/silhouette
        movement_words = ["flow", "drape", "sharp", "angular", "curved", "spiral", "geometric"]
        found_movement = [word for word in movement_words if word in text_lower]
        if found_movement:
            concepts["movement"] = found_movement
        
        # Symbolic elements
        symbol_words = ["crown", "star", "moon", "sun", "serpent", "rose", "cross", "triangle"]
        found_symbols = [symbol for symbol in symbol_words if symbol in text_lower]
        if found_symbols:
            concepts["symbols"] = found_symbols
        
        return concepts
    
    def _extract_visual_concepts(self, text):
        """Extract visual art concepts from text"""
        concepts = {}
        text_lower = text.lower()
        
        # Visual descriptors
        visual_words = ["light", "shadow", "bright", "dark", "radiant", "mysterious", "luminous", "ethereal"]
        found_visual = [word for word in visual_words if word in text_lower]
        if found_visual:
            concepts["lighting"] = found_visual
        
        # Geometric elements
        geo_words = ["circle", "triangle", "square", "spiral", "mandala", "geometric", "pattern"]
        found_geo = [word for word in geo_words if word in text_lower]
        if found_geo:
            concepts["geometry"] = found_geo
        
        # Mystical imagery
        mystical_words = ["angel", "deity", "divine", "sacred", "holy", "blessed", "transcendent"]
        found_mystical = [word for word in mystical_words if word in text_lower]
        if found_mystical:
            concepts["mystical"] = found_mystical
        
        return concepts
    
    def _generate_collection_name(self, passage_data, concepts):
        """Generate mystical fashion collection name"""
        book_words = passage_data.get('book_title', '').split()[:2]
        
        name_templates = [
            "{book} Mysteries Collection",
            "The Sacred {concept} Line", 
            "{author} Inspired: {concept} Series",
            "Mystical {concept} Couture",
            "The {concept} Transmission"
        ]
        
        template = random.choice(name_templates)
        
        # Select concept for name
        concept = "Wisdom"
        if concepts:
            category = list(concepts.keys())[0]
            concept = concepts[category][0] if concepts[category] else "Mystery"
        
        return template.format(
            book=' '.join(book_words) if book_words else "Ancient",
            concept=concept.title(),
            author=passage_data.get('author', '').split()[0] if passage_data.get('author') != "Unknown" else "Sage"
        )
    
    def _generate_fashion_pieces(self, elements, concepts):
        """Generate specific fashion pieces for the collection"""
        pieces = []
        
        # Core pieces based on tradition
        core_pieces = {
            "hermetic": ["Alchemist's Coat", "Philosopher's Robe", "Mercury Wing Jacket"],
            "thelemic": ["Ceremonial Vest", "Magus Cloak", "Star Ruby Dress"],
            "healing": ["Healer's Wrap", "Chakra Flow Dress", "Crystal Garden Top"],
            "mystical": ["Cosmic Gown", "Astral Projection Jacket", "Starseed Ensemble"]
        }
        
        base_pieces = core_pieces.get("mystical", core_pieces["mystical"])  # Default
        
        for piece_name in base_pieces[:3]:  # Top 3 pieces
            piece = {
                "name": piece_name,
                "description": self._generate_piece_description(piece_name, elements, concepts),
                "materials": random.sample(elements["textures"], 2),
                "symbolic_elements": random.sample(elements["symbols"], 2),
                "silhouette": random.choice(elements["silhouettes"]),
                "mystical_function": self._generate_mystical_function(piece_name, concepts),
                "care_instructions": "Cleanse under full moon light; charge with crystal energy"
            }
            pieces.append(piece)
        
        return pieces
    
    def _generate_piece_description(self, piece_name, elements, concepts):
        """Generate detailed piece description"""
        descriptions = {
            "coat": "Flowing ceremonial coat with hidden symbolic embroidery",
            "robe": "Luxurious ritual robe designed for sacred ceremonies",
            "jacket": "Structured blazer incorporating mystical geometry",
            "dress": "Ethereal gown that moves like liquid starlight",
            "vest": "Fitted ceremonial vest with sacred symbol details",
            "wrap": "Healing wrap that adjusts to the wearer's energy"
        }
        
        # Match piece type
        piece_type = piece_name.lower().split()[-1]
        if piece_type in descriptions:
            return descriptions[piece_type]
        
        return f"Sacred garment designed to channel mystical energies"
    
    def _generate_mystical_function(self, piece_name, concepts):
        """Generate mystical properties for fashion piece"""
        functions = [
            "Enhances intuitive abilities during meditation",
            "Protects against negative energies",
            "Amplifies creative and artistic expression", 
            "Facilitates connection with higher consciousness",
            "Balances and aligns chakra energies",
            "Attracts abundance and manifestation",
            "Enhances psychic and divination abilities"
        ]
        
        return random.choice(functions)
    
    def _generate_styling_notes(self, tradition, concepts):
        """Generate styling guidelines"""
        notes = {
            "layering": "Layer ceremonial pieces to build mystical presence",
            "accessories": "Combine with sacred geometry jewelry and crystal accents",
            "occasions": "Perfect for ritual work, meditation, or conscious gatherings",
            "energy_matching": "Choose pieces that resonate with your current spiritual work",
            "care_ritual": "Treat each piece as a sacred tool requiring energetic maintenance"
        }
        
        return notes
    
    def _generate_mystical_properties(self, concepts):
        """Generate mystical properties of the collection"""
        properties = {
            "energetic_signature": "High vibrational frequency attuned to wisdom traditions",
            "elemental_balance": "Harmonizes all four elements plus spirit",
            "chakra_alignment": "Supports full chakra system activation",
            "protection_level": "Shields against energetic interference",
            "manifestation_power": "Amplifies intention-setting and ritual work"
        }
        
        return properties
    
    def _generate_photoshoot_concept(self, tradition, concepts):
        """Generate photoshoot concept for the collection"""
        concepts_map = {
            "hermetic": {
                "location": "Ancient library or alchemical laboratory",
                "lighting": "Golden hour with dramatic shadows",
                "props": "Ancient books, alchemical symbols, crystals",
                "mood": "Mysterious wisdom seeker"
            },
            "thelemic": {
                "location": "Gothic cathedral or ceremonial chamber",
                "lighting": "Candlelight and dramatic contrasts", 
                "props": "Ritual tools, pentagram, ceremonial altar",
                "mood": "Powerful magus energy"
            },
            "healing": {
                "location": "Sacred garden or crystal cave",
                "lighting": "Soft, ethereal natural light",
                "props": "Healing crystals, plants, flowing water",
                "mood": "Serene healer presence"
            },
            "mystical": {
                "location": "Starlit mountaintop or sacred grove",
                "lighting": "Moonlight and star patterns",
                "props": "Celestial symbols, cosmic imagery",
                "mood": "Cosmic mystic channeling universal wisdom"
            }
        }
        
        return concepts_map.get(tradition, concepts_map["mystical"])
    
    def _select_artwork_inspiration(self, tradition, concepts):
        """Reference your actual artwork for inspiration"""
        art_mappings = {
            "hermetic": "LEMKE_FINAL_WALLPICTURE.jpg",
            "healing": "HealingArtRlemke11.jpg",
            "mystical": "MYSOULCOLORS.jpg", 
            "emotional": "LEMKE_BATCH1_emotion.jpg",
            "spiritual": "mysoulsings.jpg",
            "transformative": "Rebecca_Chimera.jpg"
        }
        
        selected_art = art_mappings.get(tradition, "LEMKE_SOFTLIGHT.jpg")
        
        return {
            "reference_artwork": selected_art,
            "integration_note": f"Fashion colors and textures inspired by {selected_art}",
            "artistic_elements": "Incorporate visual motifs and color story from referenced artwork"
        }
    
    def _generate_art_title(self, passage_data, concepts):
        """Generate mystical art title"""
        title_templates = [
            "The {concept} Revelation",
            "Sacred {concept} Manifestation", 
            "{concept}: A Visual Transmission",
            "The Living {concept}",
            "{concept} in the Astral Realm"
        ]
        
        concept = "Mystery"
        if concepts:
            category = list(concepts.keys())[0]
            concept = concepts[category][0] if concepts[category] else "Wonder"
        
        template = random.choice(title_templates)
        return template.format(concept=concept.title())
    
    def _generate_visual_elements(self, concepts, tradition):
        """Generate specific visual elements for artwork"""
        elements = {
            "primary_focus": "Central mystical figure or symbol",
            "background": "Cosmic or ethereal landscape",
            "lighting": "Divine light emanating from sacred source",
            "color_dominance": "Rich jewel tones with metallic accents",
            "symbolic_layers": "Multiple levels of esoteric meaning",
            "geometric_structure": "Based on sacred geometry principles"
        }
        
        return elements
    
    def _generate_color_story(self, tradition, concepts):
        """Generate detailed color story for artwork"""
        color_stories = {
            "hermetic": "Deep golds transmuting through shadow into luminous white light",
            "thelemic": "Blood red passion balanced by solar gold and void black depths",
            "healing": "Soft emerald greens flowing into sky blues with violet crown energy",
            "mystical": "Cosmic purples spiraling through star-silver into infinite indigo"
        }
        
        return color_stories.get(tradition, "Rainbow spectrum unified through golden divine light")
    
    def _generate_symbolic_meaning(self, concepts):
        """Generate symbolic interpretation of the artwork"""
        return "Visual representation of consciousness evolution through mystical understanding"
    
    def _generate_technical_specs(self, art_type):
        """Generate technical specifications"""
        specs = {
            "digital_art": {
                "resolution": "4K or higher for print quality",
                "format": "Layered PSD with individual symbol layers",
                "color_space": "Adobe RGB for rich color reproduction"
            },
            "traditional_art": {
                "size": "Gallery-ready dimensions (minimum 24x36 inches)",
                "materials": "Archival quality pigments and canvas",
                "preservation": "UV-resistant varnish for longevity"
            }
        }
        
        return specs.get(art_type, specs["digital_art"])
    
    def _generate_series_ideas(self, concepts):
        """Generate ideas for expanding into a series"""
        return [
            "Create complementary pieces exploring different aspects of the same teaching",
            "Develop seasonal variations showing wisdom evolution",
            "Build interactive AR versions with animated sacred geometry"
        ]
    
    def _reference_existing_art(self, tradition, concepts):
        """Reference your existing artwork"""
        return {
            "style_reference": "Build upon techniques used in LEMKE_SOFTLIGHT.jpg",
            "color_palette": "Draw from MYSOULCOLORS.jpg emotional spectrum",
            "composition": "Use sacred geometry principles from LEMKE_FINAL_WALLPICTURE.jpg"
        }

if __name__ == "__main__":
    engine = FashionArtEngine()
    
    # Test fashion collection generation
    test_passage = {
        'content': 'The alchemical marriage represents the union of opposites - solar and lunar, masculine and feminine, conscious and unconscious. This sacred wedding transforms base matter into spiritual gold.',
        'book_title': 'Alchemical Mysteries',
        'author': 'Marie-Louise von Franz',
        'tradition': 'hermetic'
    }
    
    collection = engine.generate_fashion_collection(test_passage)
    art_concept = engine.generate_art_concept(test_passage)
    
    print("=== FASHION COLLECTION ===")
    print(json.dumps(collection, indent=2))
    print("\n=== ART CONCEPT ===") 
    print(json.dumps(art_concept, indent=2))