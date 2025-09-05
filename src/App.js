import React, { useState } from 'react';
import './styles/App.css';
import VocabularyTab from './components/VocabularyTab';
import WordQuizTab from './components/WordQuizTab';
import SentenceQuizTab from './components/SentenceQuizTab';

function App() {
  const [activeTab, setActiveTab] = useState('vocabulary');
  const [showMenu, setShowMenu] = useState(false);
  const [showVocabMenu, setShowVocabMenu] = useState(false);
  const [vocabularySettings, setVocabularySettings] = useState({
    level: 'lesson',
    category: 'all'
  });

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const switchTab = (tab) => {
    setActiveTab(tab);
    setShowMenu(false);
  };

  // Close menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (showMenu && !event.target.closest('.menu-container')) {
        // Prevent any button functionality when clicking empty space
        event.preventDefault();
        event.stopPropagation();
        setShowMenu(false);
        setShowVocabMenu(false);
      }
    };

    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, [showMenu]);

  return (
    <div className="app-container">
      <div className="main-content">
        {/* Header with Menu */}
        <div className="tab-header">
          <h2 className="tab-title">
            {activeTab === 'vocabulary' && '스마트 반복 단어장'}
            {activeTab === 'wordQuiz' && '단어 퀴즈'}
            {activeTab === 'sentenceQuiz' && '문장 퀴즈'}
          </h2>
          <div className="menu-container">
            <button className="menu-btn" onClick={toggleMenu}>
              메뉴
            </button>
            {showMenu && (
              <div className="menu-dropdown show">
                <div 
                  className={`menu-item vocab-toggle ${activeTab === 'vocabulary' ? 'active' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (activeTab === 'vocabulary') {
                      setShowVocabMenu(!showVocabMenu);
                    } else {
                      switchTab('vocabulary');
                      setShowVocabMenu(true);
                    }
                  }}
                >
                  <span>단어장</span>
                  {activeTab === 'vocabulary' && (
                    <span className={`menu-arrow ${showVocabMenu ? 'expanded' : ''}`}>▼</span>
                  )}
                </div>
                {activeTab === 'vocabulary' && showVocabMenu && (
                  <div className="vocab-submenu">
                    <div className="menu-separator"></div>
                    <div className="submenu-section">
                      <div className="submenu-title">레벨</div>
                      <div className="submenu-buttons">
                        {[
                          { value: 'lesson', label: '수업' },
                          { value: 'n5', label: 'N5' },
                          { value: 'n4', label: 'N4' },
                          { value: 'n3', label: 'N3' }
                        ].map(level => (
                          <button
                            key={level.value}
                            className={`submenu-btn ${vocabularySettings.level === level.value ? 'active' : ''}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setVocabularySettings(prev => ({...prev, level: level.value}));
                            }}
                          >
                            {level.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="submenu-section">
                      <div className="submenu-title">카테고리</div>
                      <select 
                        className="submenu-select"
                        value={vocabularySettings.category}
                        onChange={(e) => setVocabularySettings(prev => ({...prev, category: e.target.value}))}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <option value="all">전체 보기</option>
                        <option value="동사">동사</option>
                        <option value="명사">명사</option>
                        <option value="い형용사">い형용사</option>
                        <option value="な형용사">な형용사</option>
                        <option value="부사기타">부사기타</option>
                      </select>
                    </div>
                  </div>
                )}
                <div 
                  className={`menu-item ${activeTab === 'wordQuiz' ? 'active' : ''}`}
                  onClick={() => switchTab('wordQuiz')}
                >
                  단어 퀴즈
                </div>
                <div 
                  className={`menu-item ${activeTab === 'sentenceQuiz' ? 'active' : ''}`}
                  onClick={() => switchTab('sentenceQuiz')}
                >
                  문장 퀴즈
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tab Content */}
        <div className="tab-container">
          {activeTab === 'vocabulary' && <VocabularyTab vocabularySettings={vocabularySettings} setVocabularySettings={setVocabularySettings} />}
          {activeTab === 'wordQuiz' && <WordQuizTab />}
          {activeTab === 'sentenceQuiz' && <SentenceQuizTab />}
        </div>
      </div>
    </div>
  );
}

export default App;