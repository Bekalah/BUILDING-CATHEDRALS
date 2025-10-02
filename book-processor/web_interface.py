#!/usr/bin/env python3
"""
Web interface for browsing and searching the book knowledge base
"""

from flask import Flask, render_template, request, jsonify, send_from_directory
import sqlite3
import json
import os
from pathlib import Path

app = Flask(__name__)

class BookSearcher:
    def __init__(self, db_path="books.db"):
        self.db_path = db_path
    
    def search_books(self, query="", tradition="", limit=50):
        """Search books with filters"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        where_clauses = []
        params = []
        
        if query:
            where_clauses.append("(title LIKE ? OR author LIKE ? OR subject_tags LIKE ?)")
            params.extend([f'%{query}%', f'%{query}%', f'%{query}%'])
        
        if tradition and tradition != 'all':
            where_clauses.append("tradition = ?")
            params.append(tradition)
        
        where_sql = " AND ".join(where_clauses) if where_clauses else "1=1"
        
        cursor.execute(f'''
            SELECT id, title, author, tradition, subject_tags, date_added, page_count
            FROM books 
            WHERE {where_sql}
            ORDER BY title
            LIMIT ?
        ''', params + [limit])
        
        books = cursor.fetchall()
        conn.close()
        
        return [dict(zip(['id', 'title', 'author', 'tradition', 'subjects', 'date_added', 'page_count'], book)) 
                for book in books]
    
    def search_passages(self, query, book_id=None, limit=20):
        """Search for specific passages"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        where_clauses = ["content LIKE ?"]
        params = [f'%{query}%']
        
        if book_id:
            where_clauses.append("book_id = ?")
            params.append(book_id)
        
        where_sql = " AND ".join(where_clauses)
        
        cursor.execute(f'''
            SELECT p.content, p.page_number, p.importance_score, b.title, b.author, b.id as book_id
            FROM passages p
            JOIN books b ON p.book_id = b.id
            WHERE {where_sql}
            ORDER BY p.importance_score DESC
            LIMIT ?
        ''', params + [limit])
        
        passages = cursor.fetchall()
        conn.close()
        
        return [dict(zip(['content', 'page', 'score', 'book_title', 'author', 'book_id'], passage)) 
                for passage in passages]
    
    def get_book_details(self, book_id):
        """Get detailed info about a specific book"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Get book info
        cursor.execute('SELECT * FROM books WHERE id = ?', (book_id,))
        book = cursor.fetchone()
        
        if not book:
            return None
        
        # Get key passages
        cursor.execute('''
            SELECT content, page_number, importance_score 
            FROM passages 
            WHERE book_id = ? 
            ORDER BY importance_score DESC 
            LIMIT 10
        ''', (book_id,))
        
        passages = cursor.fetchall()
        
        conn.close()
        
        return {
            'book': dict(zip(['id', 'title', 'author', 'file_path', 'file_hash', 'file_type', 
                             'date_added', 'page_count', 'tradition', 'subject_tags', 'notes'], book)),
            'key_passages': [dict(zip(['content', 'page', 'score'], passage)) for passage in passages]
        }
    
    def get_traditions(self):
        """Get list of all traditions in the database"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('SELECT DISTINCT tradition FROM books WHERE tradition IS NOT NULL ORDER BY tradition')
        traditions = [row[0] for row in cursor.fetchall()]
        
        conn.close()
        return traditions

# Initialize searcher
searcher = BookSearcher()

@app.route('/')
def index():
    """Main search interface"""
    return '''
    <!DOCTYPE html>
    <html>
    <head>
        <title>Rebecca's Book Knowledge Base</title>
        <style>
            body { font-family: 'EB Garamond', serif; max-width: 1200px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; margin-bottom: 40px; }
            .search-box { display: flex; gap: 10px; margin-bottom: 30px; }
            .search-box input, .search-box select { padding: 10px; font-size: 16px; }
            .search-box input[type="text"] { flex: 1; }
            .book-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }
            .book-card { border: 1px solid #ddd; padding: 20px; border-radius: 8px; }
            .book-title { font-weight: bold; font-size: 18px; margin-bottom: 5px; }
            .book-author { color: #666; margin-bottom: 10px; }
            .book-tradition { background: #f0f0f0; padding: 4px 8px; border-radius: 4px; font-size: 12px; }
            .passage-result { border-left: 4px solid #C6A664; padding: 15px; margin: 10px 0; background: #fafafa; }
            .passage-meta { font-size: 12px; color: #666; margin-bottom: 8px; }
            .tabs { display: flex; gap: 10px; margin-bottom: 20px; }
            .tab { padding: 10px 20px; background: #f0f0f0; cursor: pointer; border-radius: 4px; }
            .tab.active { background: #C6A664; color: white; }
            .results { min-height: 400px; }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>📚 Rebecca's Book Knowledge Base</h1>
            <p>Search your esoteric library for books, passages, and cross-references</p>
        </div>
        
        <div class="tabs">
            <div class="tab active" onclick="showTab('books')">Books</div>
            <div class="tab" onclick="showTab('passages')">Passages</div>
        </div>
        
        <div class="search-box">
            <input type="text" id="searchQuery" placeholder="Search books, authors, or content..." />
            <select id="traditionFilter">
                <option value="all">All Traditions</option>
            </select>
            <button onclick="performSearch()">Search</button>
        </div>
        
        <div id="results" class="results">
            <p>Enter a search term to find books and passages...</p>
        </div>
        
        <script>
            let currentTab = 'books';
            
            function showTab(tab) {
                currentTab = tab;
                document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
                document.querySelector(`.tab:nth-child(${tab === 'books' ? 1 : 2})`).classList.add('active');
                performSearch();
            }
            
            async function performSearch() {
                const query = document.getElementById('searchQuery').value;
                const tradition = document.getElementById('traditionFilter').value;
                
                let url = currentTab === 'books' ? '/api/search_books' : '/api/search_passages';
                url += `?query=${encodeURIComponent(query)}&tradition=${tradition}`;
                
                const response = await fetch(url);
                const data = await response.json();
                
                displayResults(data);
            }
            
            function displayResults(data) {
                const resultsDiv = document.getElementById('results');
                
                if (currentTab === 'books') {
                    if (data.length === 0) {
                        resultsDiv.innerHTML = '<p>No books found.</p>';
                        return;
                    }
                    
                    const booksHtml = data.map(book => `
                        <div class="book-card">
                            <div class="book-title">${book.title}</div>
                            <div class="book-author">by ${book.author}</div>
                            <div class="book-tradition">${book.tradition}</div>
                            <div style="margin-top: 10px;">
                                <small>Subjects: ${book.subjects || 'None'}</small>
                            </div>
                        </div>
                    `).join('');
                    
                    resultsDiv.innerHTML = `<div class="book-grid">${booksHtml}</div>`;
                } else {
                    if (data.length === 0) {
                        resultsDiv.innerHTML = '<p>No passages found.</p>';
                        return;
                    }
                    
                    const passagesHtml = data.map(passage => `
                        <div class="passage-result">
                            <div class="passage-meta">
                                <strong>${passage.book_title}</strong> by ${passage.author} (Page ${passage.page}) - Score: ${passage.score}
                            </div>
                            <div>${passage.content}</div>
                        </div>
                    `).join('');
                    
                    resultsDiv.innerHTML = passagesHtml;
                }
            }
            
            // Load traditions on page load
            fetch('/api/traditions').then(r => r.json()).then(traditions => {
                const select = document.getElementById('traditionFilter');
                traditions.forEach(t => {
                    const option = document.createElement('option');
                    option.value = t;
                    option.textContent = t.replace('_', ' ').toUpperCase();
                    select.appendChild(option);
                });
            });
            
            // Search on Enter key
            document.getElementById('searchQuery').addEventListener('keypress', function(e) {
                if (e.key === 'Enter') performSearch();
            });
        </script>
    </body>
    </html>
    '''

@app.route('/api/search_books')
def api_search_books():
    query = request.args.get('query', '')
    tradition = request.args.get('tradition', 'all')
    limit = int(request.args.get('limit', 50))
    
    books = searcher.search_books(query, tradition, limit)
    return jsonify(books)

@app.route('/api/search_passages')
def api_search_passages():
    query = request.args.get('query', '')
    book_id = request.args.get('book_id')
    limit = int(request.args.get('limit', 20))
    
    if not query:
        return jsonify([])
    
    passages = searcher.search_passages(query, book_id, limit)
    return jsonify(passages)

@app.route('/api/traditions')
def api_traditions():
    traditions = searcher.get_traditions()
    return jsonify(traditions)

@app.route('/api/book/<int:book_id>')
def api_book_details(book_id):
    details = searcher.get_book_details(book_id)
    if details:
        return jsonify(details)
    return jsonify({'error': 'Book not found'}), 404

if __name__ == '__main__':
    print("Starting Book Knowledge Base Web Interface...")
    print("Open http://localhost:5000 in your browser")
    app.run(debug=True, port=5000)