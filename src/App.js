import React, { useState } from 'react';
import './styles/App.css';
import VocabularyTab from './components/VocabularyTab';
import WordQuizTab from './components/WordQuizTab';
import SentenceQuizTab from './components/SentenceQuizTab';

function App() {
  const [activeTab, setActiveTab] = useState('vocabulary');
  const [showMenu, setShowMenu] = useState(false);

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
        setShowMenu(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
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
                  className={`menu-item ${activeTab === 'vocabulary' ? 'active' : ''}`}
                  onClick={() => switchTab('vocabulary')}
                >
                  단어장
                </div>
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
          {activeTab === 'vocabulary' && <VocabularyTab />}
          {activeTab === 'wordQuiz' && <WordQuizTab />}
          {activeTab === 'sentenceQuiz' && <SentenceQuizTab />}
        </div>
      </div>
    </div>
  );
}

export default App;