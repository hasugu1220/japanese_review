import React, { useState, useEffect } from 'react';
import { vocabularyData, getVocabularyCount, getAllWords, getCategories } from '../data/vocabularyData';
import '../styles/VocabularyTab.css';

function VocabularyTab() {
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const minSwipeDistance = 50;
  const [mode, setMode] = useState('study'); // study or known
  const [level, setLevel] = useState('lesson'); // lesson, n5, n4, n3
  const [category, setCategory] = useState('all'); // all or specific category
  const [knownLevel, setKnownLevel] = useState('all'); // for filtering known words
  const [knownWords, setKnownWords] = useState(() => {
    const saved = localStorage.getItem('knownWords');
    return saved ? JSON.parse(saved) : [];
  });
  const [wordStates, setWordStates] = useState({});
  const [allWords, setAllWords] = useState([]);
  const [filteredWords, setFilteredWords] = useState([]);
  const [showAllFurigana, setShowAllFurigana] = useState(false);
  const [showAllMeaning, setShowAllMeaning] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [showAllWords, setShowAllWords] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const wordsPerPage = 50;

  // Get vocabulary based on level
  const getVocabularyByLevel = () => {
    return vocabularyData[level] || vocabularyData.lesson;
  };

  // Initialize words
  useEffect(() => {
    const vocabulary = getVocabularyByLevel();
    const words = [];
    let index = 0;
    
    // Process categories in original order
    Object.entries(vocabulary).forEach(([cat, items]) => {
      items.forEach((item) => {
        words.push({
          ...item,
          category: cat,
          level: level,
          id: `${level}-${cat}-${item.jp}`,
          levelIndex: index++,
          originalOrder: index
        });
      });
    });
    
    setAllWords(words);
    setCurrentPosition(0);
    // Reset display states when changing level
    setShowAllFurigana(false);
    setShowAllMeaning(false);
    setWordStates({});
    setCategory('all'); // Reset category to all when changing level
  }, [level]); // eslint-disable-line react-hooks/exhaustive-deps

  // Filter words based on category and known status
  useEffect(() => {
    let filtered = [...allWords];
    
    // Filter by category
    if (category !== 'all') {
      filtered = filtered.filter(word => word.category === category);
    }
    
    // Filter by known status
    if (mode === 'study') {
      // In study mode, hide known words
      if (!showAllWords) {
        filtered = filtered.filter(word => !knownWords.includes(word.id));
      }
    } else {
      // In known mode, show only known words from selected level
      if (knownLevel === 'all') {
        // Show all known words across all levels
        const allKnownWords = [];
        Object.keys(vocabularyData).forEach(lvl => {
          const levelVocab = vocabularyData[lvl];
          Object.entries(levelVocab).forEach(([cat, items]) => {
            items.forEach((item, idx) => {
              const wordId = `${lvl}-${cat}-${item.jp}`;
              if (knownWords.includes(wordId)) {
                allKnownWords.push({
                  ...item,
                  category: cat,
                  level: lvl,
                  id: wordId,
                  levelIndex: idx
                });
              }
            });
          });
        });
        filtered = allKnownWords;
      } else {
        // Show known words from specific level
        const levelKnownWords = [];
        const levelVocab = vocabularyData[knownLevel];
        if (levelVocab) {
          Object.entries(levelVocab).forEach(([cat, items]) => {
            items.forEach((item, idx) => {
              const wordId = `${knownLevel}-${cat}-${item.jp}`;
              if (knownWords.includes(wordId)) {
                levelKnownWords.push({
                  ...item,
                  category: cat,
                  level: knownLevel,
                  id: wordId,
                  levelIndex: idx
                });
              }
            });
          });
        }
        filtered = levelKnownWords;
      }
    }
    
    setFilteredWords(filtered);
  }, [allWords, category, mode, knownWords, knownLevel, showAllWords]);

  // Pagination logic
  const paginatedWords = filteredWords.slice(
    currentPage * wordsPerPage,
    (currentPage + 1) * wordsPerPage
  );
  const totalPages = Math.ceil(filteredWords.length / wordsPerPage);

  // Handle page navigation
  const goToNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
      setTimeout(() => {
        const vocabList = document.getElementById('vocab-list');
        if (vocabList) {
          vocabList.scrollTop = 0;
        }
        window.scrollTo(0, 0);
      }, 0);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
      setTimeout(() => {
        const vocabList = document.getElementById('vocab-list');
        if (vocabList) {
          vocabList.scrollTop = 0;
        }
        window.scrollTo(0, 0);
      }, 0);
    }
  };

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(0);
  }, [category, level, mode]);

  // Touch handlers for swipe navigation
  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe && currentPage < totalPages - 1) {
      goToNextPage();
    }
    if (isRightSwipe && currentPage > 0) {
      goToPrevPage();
    }
  };

  // Get categories for current level
  const getCategoriesList = () => {
    return getCategories(level);
  };

  // Toggle word state
  const toggleWordState = (wordId, state) => {
    if (state === 'reset') {
      // Toggle visibility: if both are hidden, show both. Otherwise, hide both.
      const currentState = wordStates[wordId];
      const shouldShow = !currentState?.showFurigana && !currentState?.showMeaning;
      setWordStates(prev => ({
        ...prev,
        [wordId]: {
          showFurigana: shouldShow,
          showMeaning: shouldShow
        }
      }));
    } else {
      setWordStates(prev => ({
        ...prev,
        [wordId]: {
          ...prev[wordId],
          [state]: !prev[wordId]?.[state]
        }
      }));
    }
  };

  // Toggle show all words (including completed)
  const toggleShowAllWords = () => {
    setShowAllWords(prev => !prev);
  };
  
  // Toggle all furigana and meanings
  const toggleAllDisplay = () => {
    const shouldShow = !showAllFurigana && !showAllMeaning;
    setShowAllFurigana(shouldShow);
    setShowAllMeaning(shouldShow);
    
    const newStates = {};
    paginatedWords.forEach(word => {
      newStates[word.id] = {
        showFurigana: shouldShow,
        showMeaning: shouldShow
      };
    });
    setWordStates(newStates);
  };

  // Mark word as known
  const markAsKnown = (wordId) => {
    const newKnownWords = [...knownWords, wordId];
    setKnownWords(newKnownWords);
    localStorage.setItem('knownWords', JSON.stringify(newKnownWords));
  };

  // Restore word from known
  const restoreWord = (wordId) => {
    const newKnownWords = knownWords.filter(id => id !== wordId);
    setKnownWords(newKnownWords);
    localStorage.setItem('knownWords', JSON.stringify(newKnownWords));
  };


  // Toggle all furigana
  const toggleAllFurigana = () => {
    setShowAllFurigana(!showAllFurigana);
    const newStates = {};
    paginatedWords.forEach(word => {
      newStates[word.id] = {
        ...wordStates[word.id],
        showFurigana: !showAllFurigana
      };
    });
    setWordStates(newStates);
  };

  // Toggle all meanings
  const toggleAllMeaning = () => {
    setShowAllMeaning(!showAllMeaning);
    const newStates = {};
    paginatedWords.forEach(word => {
      newStates[word.id] = {
        ...wordStates[word.id],
        showMeaning: !showAllMeaning
      };
    });
    setWordStates(newStates);
  };


  // Reset single word
  const resetWord = (wordId) => {
    setWordStates(prev => ({
      ...prev,
      [wordId]: {
        showFurigana: false,
        showMeaning: false
      }
    }));
  };

  // Restore all words
  const restoreAll = () => {
    const levelText = knownLevel === 'all' ? '모든' : knownLevel.toUpperCase();
    if (window.confirm(`${levelText} 카테고리의 완료한 단어를 모두 되돌리시겠습니까?`)) {
      if (knownLevel === 'all') {
        setKnownWords([]);
        localStorage.setItem('knownWords', JSON.stringify([]));
      } else {
        // Remove only words from the selected level
        const levelPrefix = `${knownLevel}-`;
        const newKnownWords = knownWords.filter(id => !id.startsWith(levelPrefix));
        setKnownWords(newKnownWords);
        localStorage.setItem('knownWords', JSON.stringify(newKnownWords));
      }
    }
  };

  // Update scroll progress
  const updateScrollProgress = (e) => {
    const scrollProgress = document.getElementById('scrollProgress');
    const scrollProgressBar = document.getElementById('scrollProgressBar');
    const scrollIndicator = document.getElementById('scrollIndicator');
    
    if (scrollProgress && scrollProgressBar && scrollIndicator) {
      const scrollTop = e.target.scrollTop;
      const scrollHeight = e.target.scrollHeight - e.target.clientHeight;
      const scrollPercent = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
      
      scrollProgressBar.style.width = `${scrollPercent}%`;
      scrollProgress.classList.toggle('visible', scrollTop > 50);
      scrollIndicator.classList.toggle('visible', scrollTop > 50);
      
      // Update indicator
      const visibleIndex = Math.floor((scrollTop / scrollHeight) * filteredWords.length);
      setCurrentPosition(Math.min(visibleIndex + 1, filteredWords.length));
      scrollIndicator.textContent = `${Math.min(visibleIndex + 1, filteredWords.length)} / ${filteredWords.length}`;
    }
  };

  return (
    <div className="vocabulary-tab">
      {/* Mode Selector */}
      <div className="mode-selector">
        <button 
          className={`mode-btn ${mode === 'study' ? 'active' : ''}`}
          onClick={() => {
            setMode('study');
            setTimeout(() => {
              const vocabList = document.getElementById('vocab-list');
              if (vocabList) {
                vocabList.scrollTop = 0;
              }
              window.scrollTo(0, 0);
            }, 0);
          }}
        >
          학습할 단어 ({allWords.length - knownWords.length})
        </button>
        <button 
          className={`mode-btn ${mode === 'known' ? 'active' : ''}`}
          onClick={() => {
            setMode('known');
            setTimeout(() => {
              const knownList = document.getElementById('known-list');
              if (knownList) {
                knownList.scrollTop = 0;
              }
              window.scrollTo(0, 0);
            }, 0);
          }}
        >
          완료한 단어 ({knownWords.length})
        </button>
      </div>

      {mode === 'study' ? (
        <div id="study-mode">
          {/* Controls */}
          <div className="compact-controls">
            <select 
              className="compact-dropdown" 
              value={level} 
              onChange={(e) => {
                setLevel(e.target.value);
                setCurrentPage(0);
                // Scroll to top when changing level
                setTimeout(() => {
                  const vocabList = document.getElementById('vocab-list');
                  if (vocabList) {
                    vocabList.scrollTop = 0;
                  }
                  window.scrollTo(0, 0);
                }, 0);
              }}
            >
              <option value="lesson">수업 단어</option>
              <option value="n5">JLPT N5</option>
              <option value="n4">JLPT N4</option>
              <option value="n3">JLPT N3</option>
            </select>
            <select 
              className="compact-dropdown" 
              value={category} 
              onChange={(e) => {
                setCategory(e.target.value);
                setCurrentPage(0);  // Reset to first page when category changes
                // Scroll to top when changing category
                setTimeout(() => {
                  const vocabList = document.getElementById('vocab-list');
                  if (vocabList) {
                    vocabList.scrollTop = 0;
                  }
                  window.scrollTo(0, 0);
                }, 0);
              }}
            >
              <option value="all">전체 보기</option>
              {getCategoriesList().map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="action-controls">
            <button className="compact-action-btn" onClick={toggleAllFurigana}>
              전체 히라가나
            </button>
            <button className="compact-action-btn" onClick={toggleAllMeaning}>
              전체 뜻
            </button>
            <button className="compact-action-btn" onClick={toggleAllDisplay}>
              👁 {(showAllFurigana && showAllMeaning) ? '전체 숨기기' : '전체 보기'}
            </button>
          </div>

          <div className="mini-stats">
            <span className="mini-stat">
              전체 <strong id="totalWords">{filteredWords.length}</strong>
            </span>
            <span className="mini-stat">
              Day <strong>{currentPage + 1}</strong> / {totalPages || 1}
            </span>
            <span className="mini-stat">
              완료 <strong id="learnedPercentage">{allWords.length > 0 ? Math.round((knownWords.length / allWords.length) * 100) : 0}%</strong>
            </span>
          </div>

          {totalPages > 1 && (
            <div className="pagination-controls" style={{display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '10px'}}>
              <button 
                className="compact-action-btn" 
                onClick={goToPrevPage}
                disabled={currentPage === 0}
                style={{opacity: currentPage === 0 ? 0.5 : 1}}
              >
                ← 이전
              </button>
              <span style={{display: 'flex', alignItems: 'center', fontSize: '14px', fontWeight: 'bold'}}>
                Day {currentPage + 1}
              </span>
              <button 
                className="compact-action-btn" 
                onClick={goToNextPage}
                disabled={currentPage === totalPages - 1}
                style={{opacity: currentPage === totalPages - 1 ? 0.5 : 1}}
              >
                다음 →
              </button>
            </div>
          )}

          {/* Word List */}
          <div 
            className="interactive-vocab-list" 
            id="vocab-list"
            onScroll={updateScrollProgress}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {filteredWords.length === 0 ? (
              <div className="empty-message">모든 단어를 학습했습니다! 🎉</div>
            ) : (
              paginatedWords.sort((a, b) => a.levelIndex - b.levelIndex).map((word, index) => {
                // Use the word's original levelIndex as its permanent number
                const displayIndex = word.levelIndex + 1;
                return (
                <div key={word.id} className="interactive-word-card">
                  <span style={{position: 'absolute', top: '10px', left: '15px', color: 'rgba(255,255,255,0.7)', fontSize: '14px', fontWeight: '600'}}>
                    #{displayIndex}
                  </span>
                  <div className="word-column">
                    <div className="japanese-word">
                      {(wordStates[word.id]?.showFurigana || showAllFurigana) && word.furigana ? (
                        <ruby>{word.jp}<rt>{word.furigana}</rt></ruby>
                      ) : (
                        word.jp
                      )}
                    </div>
                    {(wordStates[word.id]?.showMeaning || showAllMeaning) && (
                      <div className="word-meaning">{word.kr}</div>
                    )}
                  </div>
                  <div className="action-buttons">
                    <button 
                      className={`action-btn-small ${wordStates[word.id]?.showFurigana ? 'active' : ''}`}
                      onClick={() => toggleWordState(word.id, 'showFurigana')}
                      disabled={!word.furigana}
                    >
                      あ
                    </button>
                    <button 
                      className={`action-btn-small ${wordStates[word.id]?.showMeaning ? 'active' : ''}`}
                      onClick={() => toggleWordState(word.id, 'showMeaning')}
                    >
                      뜻
                    </button>
                    <button 
                      className="action-btn-small btn-reset"
                      onClick={() => toggleWordState(word.id, 'reset')}
                      title="리셋"
                    >
                      👁
                    </button>
                    <button 
                      className="action-btn-small btn-know"
                      onClick={() => markAsKnown(word.id)}
                    >
                      암기완료
                    </button>
                  </div>
                </div>
                );
              })
            )}
          </div>
        </div>
      ) : (
        <div id="known-mode">
          <div className="compact-controls">
            <select 
              className="compact-dropdown" 
              value={knownLevel} 
              onChange={(e) => {
                setKnownLevel(e.target.value);
                // Scroll to top when changing known level
                const knownList = document.getElementById('known-list');
                if (knownList) {
                  knownList.scrollTop = 0;
                }
              }}
            >
              <option value="all">전체</option>
              <option value="lesson">수업 단어</option>
              <option value="n5">JLPT N5</option>
              <option value="n4">JLPT N4</option>
              <option value="n3">JLPT N3</option>
            </select>
            <button className="compact-action-btn" onClick={restoreAll}>
              {knownLevel === 'all' ? '모든' : knownLevel.toUpperCase()} 단어 되돌리기
            </button>
          </div>
          <div className="known-words-grid" id="known-list">
            {filteredWords.length === 0 ? (
              <div className="empty-message">아직 완료한 단어가 없습니다.</div>
            ) : (
              filteredWords.map(word => (
                <div 
                  key={word.id} 
                  className="known-word-card"
                  onClick={() => restoreWord(word.id)}
                >
                  <div style={{fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '4px'}}>{word.jp}</div>
                  <div style={{fontSize: '0.85rem', opacity: 0.9}}>{word.kr}</div>
                  <div style={{fontSize: '0.7rem', opacity: 0.6, marginTop: '3px'}}>✓ 완료 - 탭하여 복원</div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default VocabularyTab;