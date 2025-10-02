#!/usr/bin/env python3
"""
Text extraction and processing for different file types
Handles PDFs, DOCX, TXT, and other formats
"""

import PyPDF2
import pdfplumber
import docx
import re
from pathlib import Path
import nltk
from nltk.tokenize import sent_tokenize, word_tokenize
from nltk.corpus import stopwords
from collections import Counter

class TextExtractor:
    def __init__(self):
        # Download required NLTK data
        try:
            nltk.data.find('tokenizers/punkt')
        except LookupError:
            print("Downloading NLTK punkt tokenizer...")
            nltk.download('punkt')
        
        try:
            nltk.data.find('corpora/stopwords')
        except LookupError:
            print("Downloading NLTK stopwords...")
            nltk.download('stopwords')
        
        self.stop_words = set(stopwords.words('english'))
        
        # Key terms for hermetic/esoteric content
        self.esoteric_keywords = {
            'hermetic': ['hermes', 'hermetic', 'trismegistus', 'emerald tablet', 'alchemy', 'alchemical'],
            'kabbalah': ['kabbalah', 'sephiroth', 'tree of life', 'ain soph', 'tikkun'],
            'tarot': ['tarot', 'arcana', 'major arcana', 'minor arcana', 'fool', 'magician'],
            'astrology': ['zodiac', 'planetary', 'saturn', 'jupiter', 'mercury', 'venus'],
            'magic': ['ritual', 'invocation', 'banishing', 'pentagram', 'hexagram'],
            'psychology': ['jung', 'jungian', 'archetype', 'collective unconscious', 'shadow'],
            'healing': ['chakra', 'energy', 'healing', 'reiki', 'meditation'],
            'gnostic': ['gnostic', 'sophia', 'demiurge', 'pleroma', 'archon']
        }
    
    def extract_text(self, file_path):
        """Extract text from various file formats"""
        file_path = Path(file_path)
        file_type = file_path.suffix.lower()
        
        if file_type == '.pdf':
            return self._extract_pdf_text(file_path)
        elif file_type == '.docx':
            return self._extract_docx_text(file_path)
        elif file_type in ['.txt', '.md']:
            return self._extract_text_file(file_path)
        else:
            raise ValueError(f"Unsupported file type: {file_type}")
    
    def _extract_pdf_text(self, file_path):
        """Extract text from PDF using pdfplumber for better accuracy"""
        text_by_page = {}
        
        try:
            with pdfplumber.open(file_path) as pdf:
                for page_num, page in enumerate(pdf.pages, 1):
                    text = page.extract_text()
                    if text:
                        text_by_page[page_num] = text
        except Exception as e:
            print(f"Error extracting PDF {file_path}: {e}")
            return {}
        
        return text_by_page
    
    def _extract_docx_text(self, file_path):
        """Extract text from DOCX files"""
        try:
            doc = docx.Document(file_path)
            text = []
            
            for paragraph in doc.paragraphs:
                if paragraph.text.strip():
                    text.append(paragraph.text)
            
            return {1: '\n'.join(text)}  # Return as single "page"
        except Exception as e:
            print(f"Error extracting DOCX {file_path}: {e}")
            return {}
    
    def _extract_text_file(self, file_path):
        """Extract text from plain text files"""
        try:
            with open(file_path, 'r', encoding='utf-8') as file:
                content = file.read()
                return {1: content}
        except Exception as e:
            print(f"Error extracting text file {file_path}: {e}")
            return {}
    
    def find_key_passages(self, text, min_sentence_length=50):
        """Find important passages based on esoteric keywords and context"""
        if not text:
            return []
        
        sentences = sent_tokenize(text)
        key_passages = []
        
        for sentence in sentences:
            if len(sentence) < min_sentence_length:
                continue
            
            sentence_lower = sentence.lower()
            
            # Score sentence based on esoteric keyword presence
            score = 0
            found_keywords = []
            
            for category, keywords in self.esoteric_keywords.items():
                for keyword in keywords:
                    if keyword in sentence_lower:
                        score += 1
                        found_keywords.append((category, keyword))
            
            # Additional scoring for quoted text or emphasized content
            if '"' in sentence or "'" in sentence:
                score += 0.5
            
            if sentence.isupper() or sentence.count('*') > 2:
                score += 0.5
            
            if score > 0:
                key_passages.append({
                    'text': sentence,
                    'score': score,
                    'keywords': found_keywords
                })
        
        # Sort by score and return top passages
        key_passages.sort(key=lambda x: x['score'], reverse=True)
        return key_passages[:50]  # Top 50 passages
    
    def extract_concepts(self, text):
        """Extract key concepts and terms from text"""
        if not text:
            return {}
        
        text_lower = text.lower()
        concept_matches = {}
        
        for category, keywords in self.esoteric_keywords.items():
            matches = []
            for keyword in keywords:
                if keyword in text_lower:
                    # Count occurrences
                    count = text_lower.count(keyword)
                    matches.append({'term': keyword, 'count': count})
            
            if matches:
                concept_matches[category] = matches
        
        return concept_matches
    
    def get_text_summary(self, text):
        """Generate a summary of the text content"""
        if not text:
            return {}
        
        words = word_tokenize(text.lower())
        words = [word for word in words if word.isalpha() and word not in self.stop_words]
        
        word_freq = Counter(words)
        sentences = sent_tokenize(text)
        
        return {
            'word_count': len(words),
            'sentence_count': len(sentences),
            'unique_words': len(set(words)),
            'most_common_words': word_freq.most_common(20),
            'estimated_reading_time': len(words) / 200  # words per minute
        }

if __name__ == "__main__":
    extractor = TextExtractor()
    print("Text extraction system ready!")
    print("Supported formats: PDF, DOCX, TXT, MD")