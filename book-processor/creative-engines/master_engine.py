#!/usr/bin/env python3
"""
Master Creative Engine Controller
Orchestrates all creative engines to transform book knowledge into multiple formats
The fun playground for generating everything from fashion to games!
"""

import sys
import os
sys.path.append(os.path.dirname(__file__))

from chapter_engine import ChapterEngine
from node_engine import NodeEngine  
from fashion_art_engine import FashionArtEngine
from game_engine import GameEngine
import sqlite3
import json
import random

class MasterCreativeEngine:
    def __init__(self, db_path="../books.db"):
        self.db_path = db_path
        
        # Initialize all creative engines
        self.chapter_engine = ChapterEngine(db_path)
        self.node_engine = NodeEngine(db_path)
        self.fashion_engine = FashionArtEngine(db_path)
        self.game_engine = GameEngine(db_path)
        
        print("🎨 Master Creative Engine Initialized!")
        print("Available engines: Chapters, Nodes, Fashion, Art, Games")
    
    def create_everything_from_search(self, search_term, tradition=None, limit=3):
        """The ultimate creative explosion - turn search results into EVERYTHING!"""
        
        print(f"🚀 Creating everything from: '{search_term}'")
        if tradition:
            print(f"   Tradition filter: {tradition}")
        
        # Get passages to work with
        passages = self._get_passages(search_term, tradition, limit)
        
        if not passages:
            print("❌ No passages found!")
            return None
        
        creative_explosion = {
            "search_term": search_term,
            "tradition": tradition,
            "source_passages_count": len(passages),
            "creations": {}
        }
        
        # For each passage, create different types of content
        for i, passage in enumerate(passages):
            passage_id = f"passage_{i+1}"
            
            print(f"\n🎭 Creating from passage {i+1}: '{passage['book_title']}'...")
            
            # Create all the things!
            creations = {
                "source": {
                    "book": passage['book_title'],
                    "author": passage['author'],
                    "content_preview": passage['content'][:150] + "...",
                    "tradition": passage.get('tradition', 'unknown')
                },
                
                # Interactive chapter
                "interactive_chapter": self.chapter_engine.generate_chapter_from_passage(passage),
                
                # Complete codex node
                "codex_node": self.node_engine.generate_node_from_passage(passage, node_id=100+i),
                
                # Fashion collection
                "fashion_collection": self.fashion_engine.generate_fashion_collection(passage),
                
                # Art concept
                "art_concept": self.fashion_engine.generate_art_concept(passage),
                
                # Card game
                "card_game": self.game_engine.generate_card_game(passage),
                
                # Meditation app concept
                "meditation_app": self.game_engine.generate_interactive_experience(passage, "meditation_app")
            }
            
            creative_explosion["creations"][passage_id] = creations
            
            print(f"   ✅ Chapter: {creations['interactive_chapter']['title']}")
            print(f"   ✅ Node: {creations['codex_node']['name']}")
            print(f"   ✅ Fashion: {creations['fashion_collection']['collection_name']}")
            print(f"   ✅ Art: {creations['art_concept']['title']}")
            print(f"   ✅ Game: {creations['card_game']['name']}")
            print(f"   ✅ App: {creations['meditation_app']['name']}")
        
        return creative_explosion
    
    def create_themed_collection(self, theme, count=5):
        """Create a themed collection across all creative domains"""
        
        print(f"🎨 Creating themed collection: {theme}")
        
        # Search for theme-related passages
        passages = self._get_passages(theme, None, count)
        
        if not passages:
            print("❌ No passages found for theme!")
            return None
        
        collection = {
            "theme": theme,
            "created_date": str(datetime.now()),
            "collections": {
                "interactive_book": [],
                "codex_nodes": [],
                "fashion_lines": [],
                "art_series": [],
                "game_collection": [],
                "app_suite": []
            }
        }
        
        for passage in passages:
            # Create one of each type
            collection["collections"]["interactive_book"].append(
                self.chapter_engine.generate_chapter_from_passage(passage)
            )
            
            collection["collections"]["codex_nodes"].append(
                self.node_engine.generate_node_from_passage(passage)
            )
            
            collection["collections"]["fashion_lines"].append(
                self.fashion_engine.generate_fashion_collection(passage)
            )
            
            collection["collections"]["art_series"].append(
                self.fashion_engine.generate_art_concept(passage)
            )
            
            collection["collections"]["game_collection"].append(
                self.game_engine.generate_card_game(passage)
            )
            
            collection["collections"]["app_suite"].append(
                self.game_engine.generate_interactive_experience(passage, "meditation_app")
            )
        
        print(f"✅ Created complete themed collection with {count} items in each category!")
        return collection
    
    def create_cross_referenced_universe(self, search_terms):
        """Create an interconnected universe from multiple search terms"""
        
        print(f"🌌 Creating cross-referenced universe from: {search_terms}")
        
        universe = {
            "concept": "Interconnected Creative Universe",
            "search_terms": search_terms,
            "worlds": {},
            "connections": [],
            "master_narrative": ""
        }
        
        # Create worlds from each search term
        for term in search_terms:
            passages = self._get_passages(term, None, 2)
            
            if passages:
                world = {
                    "theme": term,
                    "chapters": [],
                    "nodes": [],
                    "fashion": [],
                    "art": [],
                    "games": []
                }
                
                for passage in passages:
                    world["chapters"].append(self.chapter_engine.generate_chapter_from_passage(passage))
                    world["nodes"].append(self.node_engine.generate_node_from_passage(passage))
                    world["fashion"].append(self.fashion_engine.generate_fashion_collection(passage))
                    world["art"].append(self.fashion_engine.generate_art_concept(passage))
                    world["games"].append(self.game_engine.generate_card_game(passage))
                
                universe["worlds"][term] = world
        
        # Generate connections between worlds
        universe["connections"] = self._generate_universe_connections(universe["worlds"])
        
        # Create master narrative
        universe["master_narrative"] = self._generate_master_narrative(search_terms)
        
        print(f"✅ Created interconnected universe with {len(universe['worlds'])} worlds!")
        return universe
    
    def generate_random_creativity_explosion(self, count=3):
        """Pure creative chaos - randomly generate amazing stuff!"""
        
        print("🎆 RANDOM CREATIVITY EXPLOSION!")
        
        # Get random passages
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT p.content, p.page_number, p.importance_score, b.title, b.author, b.tradition
            FROM passages p
            JOIN books b ON p.book_id = b.id
            ORDER BY RANDOM()
            LIMIT ?
        ''', (count,))
        
        results = cursor.fetchall()
        conn.close()
        
        if not results:
            print("❌ No passages in database!")
            return None
        
        explosion = {
            "type": "Random Creativity Explosion",
            "chaos_level": "MAXIMUM",
            "creations": []
        }
        
        creative_types = [
            ("chapter", self.chapter_engine.generate_chapter_from_passage),
            ("node", self.node_engine.generate_node_from_passage), 
            ("fashion", self.fashion_engine.generate_fashion_collection),
            ("art", self.fashion_engine.generate_art_concept),
            ("card_game", self.game_engine.generate_card_game),
            ("rpg", self.game_engine.generate_rpg_system)
        ]
        
        for result in results:
            passage_data = {
                'content': result[0],
                'page': result[1],
                'score': result[2], 
                'book_title': result[3],
                'author': result[4],
                'tradition': result[5]
            }
            
            # Randomly pick a creative type
            creative_type, creator_func = random.choice(creative_types)
            creation = creator_func(passage_data)
            
            explosion["creations"].append({
                "type": creative_type,
                "source": f"{passage_data['book_title']} by {passage_data['author']}",
                "creation": creation
            })
            
            print(f"   💫 Created {creative_type}: {creation.get('title', creation.get('name', 'Untitled'))}")
        
        return explosion
    
    def _get_passages(self, search_term, tradition, limit):
        """Get passages from database"""
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
        params.append(limit)
        
        cursor.execute(query, params)
        results = cursor.fetchall()
        conn.close()
        
        passages = []
        for result in results:
            passages.append({
                'content': result[0],
                'page': result[1],
                'score': result[2],
                'book_title': result[3],
                'author': result[4],
                'tradition': result[5]
            })
        
        return passages
    
    def _generate_universe_connections(self, worlds):
        """Generate connections between different creative worlds"""
        connections = []
        
        world_names = list(worlds.keys())
        for i, world1 in enumerate(world_names):
            for world2 in world_names[i+1:]:
                connection = {
                    "from_world": world1,
                    "to_world": world2,
                    "connection_type": random.choice([
                        "philosophical_bridge",
                        "character_crossover", 
                        "shared_mystical_principle",
                        "dimensional_portal",
                        "narrative_thread"
                    ]),
                    "description": f"The wisdom of {world1} illuminates the mysteries of {world2}"
                }
                connections.append(connection)
        
        return connections
    
    def _generate_master_narrative(self, search_terms):
        """Generate overarching narrative for the creative universe"""
        narrative = f"""
        In the grand tapestry of consciousness, the threads of {', '.join(search_terms[:-1])} and {search_terms[-1]} 
        weave together to create a magnificent mandala of understanding. Each creative expression - whether chapter, 
        node, fashion, art, or game - represents a facet of the same divine jewel, reflecting different aspects of 
        eternal wisdom.
        
        The seeker may begin their journey in any realm, following any thread, and discover that all paths lead 
        to the same mountain peak of illumination. Fashion becomes ritual, games become initiation, art becomes 
        prayer, and chapters become lived experience.
        
        This is the Cathedral of Circuits made manifest - where ancient wisdom flows through modern creative 
        expression, transforming both creator and audience in the sacred dance of understanding.
        """
        
        return narrative.strip()
    
    def export_creation(self, creation_data, format_type="json"):
        """Export creations in various formats"""
        from datetime import datetime
        
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        
        if format_type == "json":
            filename = f"creation_export_{timestamp}.json"
            with open(filename, 'w') as f:
                json.dump(creation_data, f, indent=2, ensure_ascii=False)
            
            print(f"✅ Exported to {filename}")
            return filename
        
        elif format_type == "markdown":
            filename = f"creation_export_{timestamp}.md"
            # Convert to markdown format
            md_content = self._convert_to_markdown(creation_data)
            
            with open(filename, 'w') as f:
                f.write(md_content)
            
            print(f"✅ Exported to {filename}")
            return filename
    
    def _convert_to_markdown(self, data):
        """Convert creation data to markdown format"""
        # This would be a comprehensive markdown converter
        # For now, return basic structure
        return f"# Creative Export\n\n```json\n{json.dumps(data, indent=2)}\n```"

if __name__ == "__main__":
    # Initialize the master engine
    master = MasterCreativeEngine()
    
    print("\n🎨 MASTER CREATIVE ENGINE READY!")
    print("\nExample commands:")
    print("1. master.create_everything_from_search('shadow work')")
    print("2. master.create_themed_collection('alchemy', 3)")
    print("3. master.generate_random_creativity_explosion(5)")
    print("4. master.create_cross_referenced_universe(['tarot', 'chakras', 'alchemy'])")
    
    # Test run
    print("\n🚀 Running test creation...")
    test_creation = master.generate_random_creativity_explosion(1)
    
    if test_creation:
        print(f"\n✨ Test successful! Created {len(test_creation['creations'])} items")
        print("Ready for creative magic! 🎭✨")