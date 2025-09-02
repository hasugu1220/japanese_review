import React, { useState } from 'react';
import { vocabularyByPOS } from '../data/vocabularyByPOS';
import VocabCard from './common/VocabCard';

const SimpleVocabulary = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const getDisplayVocabulary = () => {
    if (selectedCategory === 'all') {
      const allWords = [];
      Object.keys(vocabularyByPOS).forEach(category => {
        vocabularyByPOS[category].forEach(word => {
          allWords.push({ ...word, category });
        });
      });
      return allWords;
    } else {
      return vocabularyByPOS[selectedCategory]?.map(word => ({ 
        ...word, 
        category: selectedCategory 
      })) || [];
    }
  };

  const getCategoryCount = (category) => {
    if (category === 'all') {
      return Object.values(vocabularyByPOS).reduce((acc, words) => acc + words.length, 0);
    }
    return vocabularyByPOS[category]?.length || 0;
  };

  return (
    <div id="vocabulary" className="tab-content active">
      <h2>단어장</h2>
      
      {/* 품사별 필터 */}
      <div className="filter-section">
        <select 
          className="filter-dropdown" 
          value={selectedCategory} 
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="all">전체 보기 ({getCategoryCount('all')}개)</option>
          {Object.keys(vocabularyByPOS).map(category => (
            <option key={category} value={category}>
              {category} ({getCategoryCount(category)}개)
            </option>
          ))}
        </select>
      </div>

      {/* 선택된 카테고리 정보 */}
      {selectedCategory !== 'all' && (
        <div style={{ 
          background: 'linear-gradient(135deg, #f0f8ff 0%, #e8f4ff 100%)', 
          padding: '12px', 
          borderRadius: '10px', 
          marginBottom: '15px',
          textAlign: 'center',
          borderLeft: '4px solid #667eea'
        }}>
          <strong style={{ color: '#667eea', fontSize: '1.1rem' }}>
            {selectedCategory}
          </strong>
          <span style={{ 
            color: '#666', 
            marginLeft: '10px',
            fontSize: '0.95rem' 
          }}>
            총 {getCategoryCount(selectedCategory)}개 단어
          </span>
        </div>
      )}

      {/* 단어 카드 그리드 */}
      <div className="vocab-grid">
        {getDisplayVocabulary().map((word, index) => (
          <VocabCard 
            key={`${word.category}-${index}`}
            japanese={word.jp}
            korean={word.kr}
            category={word.category}
            furigana={word.furigana}
          />
        ))}
      </div>

      {/* 빈 상태 메시지 */}
      {getDisplayVocabulary().length === 0 && (
        <div style={{ 
          textAlign: 'center', 
          padding: '60px 20px', 
          color: '#999' 
        }}>
          표시할 단어가 없습니다.
        </div>
      )}
    </div>
  );
};

export default SimpleVocabulary;