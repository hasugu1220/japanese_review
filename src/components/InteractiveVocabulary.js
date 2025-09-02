import React, { useState, useEffect } from 'react';
import { vocabularyByPOS } from '../data/vocabularyByPOS';

const InteractiveVocabulary = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [knownWords, setKnownWords] = useState(() => {
    const saved = localStorage.getItem('knownWords');
    return saved ? JSON.parse(saved) : [];
  });
  const [wordStates, setWordStates] = useState({});
  const [viewMode, setViewMode] = useState('study'); // 'study' or 'known'

  // localStorage에 저장
  useEffect(() => {
    localStorage.setItem('knownWords', JSON.stringify(knownWords));
  }, [knownWords]);

  const getDisplayWords = () => {
    if (viewMode === 'known') {
      return knownWords;
    }

    let words = [];
    if (selectedCategory === 'all') {
      Object.keys(vocabularyByPOS).forEach(category => {
        vocabularyByPOS[category].forEach(word => {
          words.push({ ...word, category });
        });
      });
    } else {
      words = vocabularyByPOS[selectedCategory]?.map(word => ({ 
        ...word, 
        category: selectedCategory 
      })) || [];
    }

    // 아는 단어 제외
    return words.filter(word => 
      !knownWords.find(kw => kw.jp === word.jp && kw.kr === word.kr)
    );
  };

  const handleKnow = (word) => {
    setKnownWords([...knownWords, word]);
  };


  const toggleFurigana = (word) => {
    setWordStates({
      ...wordStates,
      [word.jp]: { 
        ...wordStates[word.jp], 
        showFurigana: !wordStates[word.jp]?.showFurigana 
      }
    });
  };

  const toggleMeaning = (word) => {
    setWordStates({
      ...wordStates,
      [word.jp]: { 
        ...wordStates[word.jp], 
        showMeaning: !wordStates[word.jp]?.showMeaning 
      }
    });
  };

  const restoreWord = (word) => {
    setKnownWords(knownWords.filter(kw => 
      !(kw.jp === word.jp && kw.kr === word.kr)
    ));
  };

  const restoreAllWords = () => {
    if (window.confirm('모든 아는 단어를 되돌리시겠습니까?')) {
      setKnownWords([]);
      setWordStates({});
    }
  };

  const renderWordCard = (word, index) => {
    const state = wordStates[word.jp] || {};
    const hasKanji = /[一-龯]/.test(word.jp);

    return (
      <div key={index} className="interactive-word-card">
        <div className="word-column">
          <div className="japanese-word">
            {state.showFurigana && word.furigana && hasKanji ? (
              <ruby>
                {word.jp}
                <rt style={{ color: 'white', fontSize: '0.6em' }}>{word.furigana}</rt>
              </ruby>
            ) : (
              word.jp
            )}
          </div>
          {state.showMeaning && (
            <div className="word-meaning">{word.kr}</div>
          )}
        </div>
        
        <div className="action-buttons">
          <button 
            className={`action-btn-small ${state.showFurigana ? 'active' : ''}`}
            onClick={() => toggleFurigana(word)}
            disabled={!hasKanji || !word.furigana}
            style={{ opacity: (!hasKanji || !word.furigana) ? '0.5' : '1' }}
          >
            あ
          </button>
          <button 
            className={`action-btn-small ${state.showMeaning ? 'active' : ''}`}
            onClick={() => toggleMeaning(word)}
          >
            뜻
          </button>
          <button 
            className="action-btn-small btn-know btn-know-long"
            onClick={() => handleKnow(word)}
          >
            안다
          </button>
        </div>
      </div>
    );
  };

  const renderKnownWordCard = (word, index) => {
    return (
      <div key={index} className="known-word-card" onClick={() => restoreWord(word)}>
        <div className="japanese-word">{word.jp}</div>
        <div className="korean-meaning">{word.kr}</div>
        <div className="restore-hint">클릭하여 복원</div>
      </div>
    );
  };

  return (
    <div id="vocabulary" className="tab-content active">
      <h2>인터랙티브 단어장</h2>
      
      {/* 모드 선택 */}
      <div className="mode-selector">
        <button 
          className={`mode-btn ${viewMode === 'study' ? 'active' : ''}`}
          onClick={() => setViewMode('study')}
        >
          학습 모드 ({getDisplayWords().length}개)
        </button>
        <button 
          className={`mode-btn ${viewMode === 'known' ? 'active' : ''}`}
          onClick={() => setViewMode('known')}
        >
          아는 단어 ({knownWords.length}개)
        </button>
      </div>

      {viewMode === 'study' ? (
        <>
          {/* 카테고리 선택 */}
          <div className="filter-section">
            <select 
              className="filter-dropdown" 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">전체 보기</option>
              {Object.keys(vocabularyByPOS).map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* 단어 목록 */}
          <div className="interactive-vocab-list">
            {getDisplayWords().map((word, index) => renderWordCard(word, index))}
          </div>

          {getDisplayWords().length === 0 && (
            <div className="empty-message">
              모든 단어를 학습했습니다! 
              <br/>
              '아는 단어' 탭에서 복원할 수 있습니다.
            </div>
          )}
        </>
      ) : (
        <>
          {/* 아는 단어 관리 */}
          <div className="known-words-header">
            <button 
              className="action-btn btn-secondary"
              onClick={restoreAllWords}
              disabled={knownWords.length === 0}
            >
              모든 단어 되돌리기
            </button>
          </div>

          <div className="known-words-grid">
            {knownWords.map((word, index) => renderKnownWordCard(word, index))}
          </div>

          {knownWords.length === 0 && (
            <div className="empty-message">
              아직 학습한 단어가 없습니다.
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default InteractiveVocabulary;