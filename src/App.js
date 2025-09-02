import React, { useState } from 'react';
import './styles/App.css';
import './styles/enhanced.css';
import './styles/interactive.css';
import './styles/mobile-first.css';
import Header from './components/Header';
import InteractiveVocabulary from './components/InteractiveVocabulary';
import WordQuiz from './components/WordQuiz';
import SentenceQuiz from './components/SentenceQuiz';
import OneByOneQuestionGenerator from './components/OneByOneQuestionGenerator';

function App() {
  const [activeTab, setActiveTab] = useState('vocabulary');

  const renderContent = () => {
    switch (activeTab) {
      case 'vocabulary':
        return <InteractiveVocabulary />;
      case 'word-quiz':
        return <WordQuiz />;
      case 'sentence-quiz':
        return <SentenceQuiz />;
      case 'generator':
        return <OneByOneQuestionGenerator />;
      default:
        return <InteractiveVocabulary />;
    }
  };

  return (
    <div className="app-container">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="main-content">
        {renderContent()}
      </div>
    </div>
  );
}

export default App;