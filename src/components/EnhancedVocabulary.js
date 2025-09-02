import React, { useState } from 'react';
import { weeklyVocabulary, getAllVocabulary } from '../data/weeklyVocabulary';
import VocabCard from './common/VocabCard';

const EnhancedVocabulary = () => {
  const [viewMode, setViewMode] = useState('all'); // 'all', 'weekly', 'category'
  const [selectedWeek, setSelectedWeek] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const getDisplayVocabulary = () => {
    if (viewMode === 'all') {
      const allVocab = getAllVocabulary();
      if (selectedCategory === 'all') {
        const allWords = [];
        Object.keys(allVocab).forEach(category => {
          allVocab[category].forEach(word => {
            allWords.push({ ...word, category });
          });
        });
        return allWords;
      } else {
        return allVocab[selectedCategory]?.map(word => ({ ...word, category: selectedCategory })) || [];
      }
    } else if (viewMode === 'weekly' && selectedWeek) {
      const weekData = weeklyVocabulary[selectedWeek];
      if (!weekData) return [];
      
      const allWords = [];
      Object.keys(weekData.categories).forEach(category => {
        weekData.categories[category].forEach(word => {
          allWords.push({ ...word, category });
        });
      });
      return allWords;
    }
    
    return [];
  };

  const getAllCategories = () => {
    const allVocab = getAllVocabulary();
    return Object.keys(allVocab);
  };

  return (
    <div id="vocabulary" className="tab-content active">
      <h2>단어장</h2>
      
      {/* 보기 모드 선택 */}
      <div style={{ marginBottom: '15px' }}>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <button 
            className={`action-btn ${viewMode === 'all' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setViewMode('all')}
            style={{ width: 'auto', padding: '10px 20px' }}
          >
            전체 보기
          </button>
          <button 
            className={`action-btn ${viewMode === 'weekly' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setViewMode('weekly')}
            style={{ width: 'auto', padding: '10px 20px' }}
          >
            주차별 보기
          </button>
        </div>
      </div>

      {/* 필터 섹션 */}
      <div className="filter-section">
        {viewMode === 'all' && (
          <select 
            className="filter-dropdown" 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">전체 카테고리</option>
            {getAllCategories().map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        )}
        
        {viewMode === 'weekly' && (
          <select 
            className="filter-dropdown" 
            value={selectedWeek} 
            onChange={(e) => setSelectedWeek(e.target.value)}
          >
            <option value="">주차를 선택하세요</option>
            {Object.keys(weeklyVocabulary).map(weekId => (
              <option key={weekId} value={weekId}>
                {weeklyVocabulary[weekId].date}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* 선택된 주차 정보 표시 */}
      {viewMode === 'weekly' && selectedWeek && weeklyVocabulary[selectedWeek] && (
        <div style={{ 
          background: '#f0f8ff', 
          padding: '10px', 
          borderRadius: '8px', 
          marginBottom: '15px',
          textAlign: 'center'
        }}>
          <strong>{weeklyVocabulary[selectedWeek].date}</strong>
          <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '5px' }}>
            카테고리: {Object.keys(weeklyVocabulary[selectedWeek].categories).join(', ')}
          </div>
        </div>
      )}

      {/* 단어 카드 그리드 */}
      <div className="vocab-grid">
        {getDisplayVocabulary().map((word, index) => (
          <VocabCard 
            key={index}
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
          padding: '40px', 
          color: '#999' 
        }}>
          {viewMode === 'weekly' && !selectedWeek 
            ? '주차를 선택해주세요.' 
            : '표시할 단어가 없습니다.'}
        </div>
      )}
    </div>
  );
};

export default EnhancedVocabulary;