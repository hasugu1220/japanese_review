import React, { useState } from 'react';
import { vocabulary } from '../data/vocabulary';

const Vocabulary = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const displayVocabulary = () => {
    if (selectedCategory === 'all') {
      const allWords = [];
      Object.keys(vocabulary).forEach(category => {
        vocabulary[category].forEach(word => {
          allWords.push({ ...word, category });
        });
      });
      return allWords;
    } else {
      return vocabulary[selectedCategory]?.map(word => ({ ...word, category: selectedCategory })) || [];
    }
  };

  return (
    <div id="vocabulary" className="tab-content active">
      <h2>단어장</h2>
      <div className="filter-section">
        <select 
          className="filter-dropdown" 
          value={selectedCategory} 
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="all">전체 보기</option>
          {Object.keys(vocabulary).map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>
      <div className="vocab-grid">
        {displayVocabulary().map((word, index) => (
          <div key={index} className="vocab-card">
            <div className="japanese-text">{word.jp}</div>
            <div className="korean-text">{word.kr}</div>
            <div className="category-label">{word.category}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Vocabulary;