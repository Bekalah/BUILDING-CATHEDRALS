#!/usr/bin/env python3
"""
Book Processing System for Rebecca's Library
Core database setup and book ingestion
"""

import sqlite3
import os
import json
from datetime import datetime
from pathlib import Path
import hashlib

class BookDatabase:
    def __init__(self, db_path="books.db"):
        self.db_path = db_path
        self.init_database()
    
    def init_database(self):
        """Initialize the database with all necessary tables"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Books table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS books (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                author TEXT,
                file_path TEXT UNIQUE,
                file_hash TEXT,
                file_type TEXT,
                date_added DATETIME DEFAULT CURRENT_TIMESTAMP,
                page_count INTEGER,
                tradition TEXT,
                subject_tags TEXT,
                notes TEXT
            )
        ''')
        
        # Passages table for extracted content
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS passages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                book_id INTEGER,
                page_number INTEGER,
                content TEXT NOT NULL,
                context TEXT,
                keywords TEXT,
                importance_score REAL,
                passage_type TEXT,
                FOREIGN KEY (book_id) REFERENCES books (id)
            )
        ''')
        
        # Concepts table for cross-referencing
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS concepts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT UNIQUE,
                description TEXT,
                tradition TEXT,
                related_concepts TEXT
            )
        ''')
        
        # Book-concept relationships
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS book_concepts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                book_id INTEGER,
                concept_id INTEGER,
                relevance_score REAL,
                page_references TEXT,
                FOREIGN KEY (book_id) REFERENCES books (id),
                FOREIGN KEY (concept_id) REFERENCES concepts (id)
            )
        ''')
        
        # Cross-references between books
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS cross_references (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                book1_id INTEGER,
                book2_id INTEGER,
                connection_type TEXT,
                description TEXT,
                strength REAL,
                FOREIGN KEY (book1_id) REFERENCES books (id),
                FOREIGN KEY (book2_id) REFERENCES books (id)
            )
        ''')
        
        conn.commit()
        conn.close()
        print("Database initialized successfully!")
    
    def add_book(self, title, author, file_path, tradition=None, subject_tags=None):
        """Add a book to the database"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Calculate file hash for duplicate detection
        file_hash = self._calculate_file_hash(file_path)
        file_type = Path(file_path).suffix.lower()
        
        try:
            cursor.execute('''
                INSERT INTO books (title, author, file_path, file_hash, file_type, tradition, subject_tags)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            ''', (title, author, file_path, file_hash, file_type, tradition, subject_tags))
            
            book_id = cursor.lastrowid
            conn.commit()
            print(f"Added book: {title} by {author}")
            return book_id
            
        except sqlite3.IntegrityError:
            print(f"Book already exists: {title}")
            return None
        finally:
            conn.close()
    
    def _calculate_file_hash(self, file_path):
        """Calculate MD5 hash of file for duplicate detection"""
        hash_md5 = hashlib.md5()
        try:
            with open(file_path, "rb") as f:
                for chunk in iter(lambda: f.read(4096), b""):
                    hash_md5.update(chunk)
            return hash_md5.hexdigest()
        except FileNotFoundError:
            return None
    
    def get_all_books(self):
        """Retrieve all books from database"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('SELECT * FROM books ORDER BY title')
        books = cursor.fetchall()
        conn.close()
        
        return books
    
    def search_books(self, query, field='title'):
        """Search books by title, author, or content"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        if field == 'content':
            # Search in passages
            cursor.execute('''
                SELECT DISTINCT b.* FROM books b
                JOIN passages p ON b.id = p.book_id
                WHERE p.content LIKE ?
            ''', (f'%{query}%',))
        else:
            cursor.execute(f'SELECT * FROM books WHERE {field} LIKE ?', (f'%{query}%',))
        
        results = cursor.fetchall()
        conn.close()
        
        return results

if __name__ == "__main__":
    # Initialize the database
    db = BookDatabase()
    print("Book processing system ready!")
    print("Database created at:", os.path.abspath(db.db_path))