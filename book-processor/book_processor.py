#!/usr/bin/env python3
"""
Main book processor - orchestrates the entire system
Scans directories, processes books, and builds the knowledge base
"""

import os
import sys
from pathlib import Path
import argparse
from book_database import BookDatabase
from text_extractor import TextExtractor

class BookProcessor:
    def __init__(self, db_path="books.db"):
        self.db = BookDatabase(db_path)
        self.extractor = TextExtractor()
        
        # Predefined traditions and subjects for auto-tagging
        self.tradition_keywords = {
            'hermetic': ['hermes', 'hermetic', 'emerald tablet', 'corpus hermeticum'],
            'thelemic': ['crowley', 'thelema', 'liber', 'aeon', '93'],
            'golden_dawn': ['golden dawn', 'mathers', 'westcott', 'woodman'],
            'jungian': ['jung', 'jungian', 'archetype', 'collective unconscious'],
            'kabbalah': ['kabbalah', 'sephiroth', 'tree of life', 'zohar'],
            'tarot': ['tarot', 'rider waite', 'thoth deck', 'marseilles'],
            'astrology': ['astrology', 'horoscope', 'natal chart', 'planetary'],
            'healing': ['reiki', 'chakra', 'energy healing', 'meditation'],
            'chaos_magic': ['chaos magic', 'sigil', 'peter carroll', 'phil hine']
        }
    
    def scan_directory(self, directory_path, recursive=True):
        """Scan directory for books and add them to database"""
        directory = Path(directory_path)
        
        if not directory.exists():
            print(f"Directory not found: {directory_path}")
            return
        
        supported_formats = {'.pdf', '.docx', '.txt', '.md'}
        
        if recursive:
            pattern = "**/*"
        else:
            pattern = "*"
        
        books_found = 0
        books_processed = 0
        
        print(f"Scanning directory: {directory_path}")
        
        for file_path in directory.glob(pattern):
            if file_path.is_file() and file_path.suffix.lower() in supported_formats:
                books_found += 1
                print(f"\nFound: {file_path.name}")
                
                if self.process_single_book(file_path):
                    books_processed += 1
        
        print(f"\n=== Scan Complete ===")
        print(f"Books found: {books_found}")
        print(f"Books processed: {books_processed}")
    
    def process_single_book(self, file_path):
        """Process a single book file"""
        try:
            file_path = Path(file_path)
            
            # Extract basic info from filename
            title = self._extract_title_from_filename(file_path.name)
            author = self._extract_author_from_filename(file_path.name)
            
            print(f"Processing: {title}")
            
            # Extract text content
            text_by_page = self.extractor.extract_text(file_path)
            
            if not text_by_page:
                print(f"  ❌ No text extracted from {file_path.name}")
                return False
            
            # Combine all text for analysis
            full_text = " ".join(text_by_page.values())
            
            # Auto-detect tradition and subjects
            tradition = self._detect_tradition(full_text)
            subjects = self._detect_subjects(full_text)
            
            # Add book to database
            book_id = self.db.add_book(
                title=title,
                author=author,
                file_path=str(file_path),
                tradition=tradition,
                subject_tags=",".join(subjects)
            )
            
            if book_id:
                # Process and store key passages
                self._store_key_passages(book_id, text_by_page)
                print(f"  ✅ Processed successfully")
                return True
            else:
                print(f"  ⚠️ Already in database")
                return False
                
        except Exception as e:
            print(f"  ❌ Error processing {file_path.name}: {e}")
            return False
    
    def _extract_title_from_filename(self, filename):
        """Extract title from filename"""
        # Remove extension
        title = Path(filename).stem
        
        # Clean up common patterns
        title = title.replace('_', ' ')
        title = title.replace('-', ' ')
        
        # Remove common prefixes/suffixes
        patterns_to_remove = [
            r'^\d{4}\s*[-_]\s*',  # Year prefix
            r'\s*[-_]\s*\d+$',    # Number suffix
            r'\.pdf$', r'\.docx$', r'\.txt$'  # Extensions
        ]
        
        import re
        for pattern in patterns_to_remove:
            title = re.sub(pattern, '', title, flags=re.IGNORECASE)
        
        return title.strip()
    
    def _extract_author_from_filename(self, filename):
        """Try to extract author from filename"""
        # Common patterns: "Author - Title", "Title by Author"
        import re
        
        filename_stem = Path(filename).stem
        
        # Pattern: "Author - Title"
        match = re.search(r'^([^-]+)\s*-\s*(.+)', filename_stem)
        if match:
            return match.group(1).strip()
        
        # Pattern: "Title by Author"
        match = re.search(r'(.+)\s+by\s+([^.]+)', filename_stem, re.IGNORECASE)
        if match:
            return match.group(2).strip()
        
        return "Unknown"
    
    def _detect_tradition(self, text):
        """Auto-detect the primary tradition/lineage of the text"""
        text_lower = text.lower()
        tradition_scores = {}
        
        for tradition, keywords in self.tradition_keywords.items():
            score = 0
            for keyword in keywords:
                score += text_lower.count(keyword)
            
            if score > 0:
                tradition_scores[tradition] = score
        
        if tradition_scores:
            # Return tradition with highest score
            return max(tradition_scores.items(), key=lambda x: x[1])[0]
        
        return "unknown"
    
    def _detect_subjects(self, text):
        """Detect multiple subjects/themes in the text"""
        text_lower = text.lower()
        subjects = []
        
        for tradition, keywords in self.tradition_keywords.items():
            for keyword in keywords:
                if keyword in text_lower:
                    subjects.append(tradition)
                    break  # Don't double-count same tradition
        
        return list(set(subjects))  # Remove duplicates
    
    def _store_key_passages(self, book_id, text_by_page):
        """Extract and store key passages from the book"""
        import sqlite3
        
        conn = sqlite3.connect(self.db.db_path)
        cursor = conn.cursor()
        
        passages_stored = 0
        
        for page_num, page_text in text_by_page.items():
            key_passages = self.extractor.find_key_passages(page_text)
            
            for passage in key_passages:
                try:
                    cursor.execute('''
                        INSERT INTO passages (book_id, page_number, content, keywords, importance_score, passage_type)
                        VALUES (?, ?, ?, ?, ?, ?)
                    ''', (
                        book_id,
                        page_num,
                        passage['text'],
                        str(passage['keywords']),
                        passage['score'],
                        'key_passage'
                    ))
                    passages_stored += 1
                except Exception as e:
                    print(f"Error storing passage: {e}")
        
        conn.commit()
        conn.close()
        
        print(f"  📝 Stored {passages_stored} key passages")

def main():
    parser = argparse.ArgumentParser(description='Process books and build knowledge base')
    parser.add_argument('directory', help='Directory containing books to process')
    parser.add_argument('--db', default='books.db', help='Database file path')
    parser.add_argument('--no-recursive', action='store_true', help='Don\'t scan subdirectories')
    
    args = parser.parse_args()
    
    processor = BookProcessor(args.db)
    processor.scan_directory(args.directory, recursive=not args.no_recursive)

if __name__ == "__main__":
    if len(sys.argv) > 1:
        main()
    else:
        print("Book Processor Ready!")
        print("\nUsage:")
        print("  python book_processor.py /path/to/books/")
        print("  python book_processor.py /path/to/books/ --db custom.db")
        print("\nOr use interactively:")
        processor = BookProcessor()
        print(f"Database ready at: {os.path.abspath(processor.db.db_path)}")