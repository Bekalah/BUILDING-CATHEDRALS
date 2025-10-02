# Book Knowledge Base System

A powerful tool to catalog, search, and cross-reference Rebecca's esoteric book collection.

## Quick Start

1. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Process your books:**
   ```bash
   python book_processor.py "/path/to/your/books/"
   ```

3. **Launch web interface:**
   ```bash
   python web_interface.py
   ```
   Then open http://localhost:5000

## Features

### 📚 **Smart Book Cataloging**
- Auto-extracts titles and authors from filenames
- Detects traditions (Hermetic, Thelemic, Jungian, etc.)
- Handles PDF, DOCX, TXT, and Markdown files
- Prevents duplicates with file hashing

### 🔍 **Intelligent Search**
- Search by title, author, tradition, or content
- Find key passages with esoteric keywords
- Cross-reference concepts across books
- Score passages by importance

### 🕸️ **Knowledge Mapping**
- Auto-tags books by tradition and subject
- Extracts key concepts and terminology
- Builds connections between related works
- Tracks influences and lineages

### 🌐 **Web Interface**
- Clean, accessible design using your brand colors
- Search books and passages in real-time
- Filter by tradition or subject
- View detailed book information

## Supported Traditions & Keywords

The system automatically detects and categorizes content based on these traditions:

- **Hermetic**: Hermes, Trismegistus, Emerald Tablet, Alchemy
- **Thelemic**: Crowley, Liber, 93, Aeon
- **Kabbalah**: Sephiroth, Tree of Life, Zohar
- **Jungian**: Archetypes, Collective Unconscious, Shadow
- **Tarot**: Major Arcana, Rider-Waite, Thoth
- **Golden Dawn**: Mathers, Westcott, Ritual Magic
- **Healing**: Reiki, Chakras, Energy Work
- **Chaos Magic**: Sigils, Peter Carroll, Phil Hine
- **Gnostic**: Sophia, Pleroma, Archons

## File Structure

```
book-processor/
├── book_database.py      # Database management
├── text_extractor.py     # Text extraction from files
├── book_processor.py     # Main processing engine
├── web_interface.py      # Web search interface
├── requirements.txt      # Python dependencies
└── books.db             # SQLite database (created automatically)
```

## Usage Examples

### Command Line Processing
```bash
# Process all books in a directory
python book_processor.py "/Users/rebecca/Books/"

# Use custom database file
python book_processor.py "/path/to/books/" --db my_books.db

# Don't scan subdirectories
python book_processor.py "/path/to/books/" --no-recursive
```

### Database Queries
```python
from book_database import BookDatabase

db = BookDatabase()

# Get all books
books = db.get_all_books()

# Search by title
results = db.search_books("Jung", field="title")

# Search content
content_results = db.search_books("archetype", field="content")
```

### Text Analysis
```python
from text_extractor import TextExtractor

extractor = TextExtractor()

# Extract text from PDF
text = extractor.extract_text("book.pdf")

# Find key passages
passages = extractor.find_key_passages(text)

# Get concept analysis
concepts = extractor.extract_concepts(text)
```

## Next Steps

After processing your books, you can:

1. **Export data** for your Cathedral of Circuits project
2. **Generate citations** for your writing
3. **Find cross-references** between authors and concepts
4. **Build visual maps** of knowledge connections
5. **Create reading lists** by theme or tradition

This system will grow more powerful as you add more books - it learns the patterns in your collection and gets better at identifying relevant content.

## Integration with Cathedral Project

The book processor is designed to feed directly into your Cathedral of Circuits codex:

- Extract authentic source material for your nodes
- Build proper lineage documentation
- Find artwork inspiration from mystical texts  
- Generate citations for scholarly credibility
- Connect your work to established traditions

No more AI-generated placeholder content - build on real knowledge!