import React, { useState } from 'react';
import { allSentences } from '../data/allSentences';

const SimpleQuestionGenerator = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [generatedQuestions, setGeneratedQuestions] = useState([]);

  // 주차별 의문문 생성
  const generateCategoryQuestions = () => {
    if (!selectedCategory) {
      alert('카테고리를 선택해주세요.');
      return;
    }

    const items = allSentences[selectedCategory] || [];
    const questions = items.filter(item => 
      item.jp.endsWith('？') || item.jp.endsWith('?')
    );

    if (questions.length === 0) {
      alert('선택한 카테고리에 의문문이 없습니다.');
      return;
    }

    const selected = [];
    const usedIndices = new Set();
    
    while (selected.length < Math.min(5, questions.length) && usedIndices.size < questions.length) {
      const randomIndex = Math.floor(Math.random() * questions.length);
      if (!usedIndices.has(randomIndex)) {
        usedIndices.add(randomIndex);
        selected.push(questions[randomIndex]);
      }
    }
    
    setGeneratedQuestions(selected);
  };

  // 랜덤 의문문 생성 (모든 카테고리에서)
  const generateRandomQuestions = () => {
    const allQuestions = [];
    
    Object.values(allSentences).forEach(items => {
      items.forEach(item => {
        if (item.jp.endsWith('？') || item.jp.endsWith('?')) {
          allQuestions.push(item);
        }
      });
    });

    if (allQuestions.length === 0) {
      alert('의문문이 없습니다.');
      return;
    }

    const selected = [];
    const usedIndices = new Set();
    
    while (selected.length < 10 && usedIndices.size < allQuestions.length) {
      const randomIndex = Math.floor(Math.random() * allQuestions.length);
      if (!usedIndices.has(randomIndex)) {
        usedIndices.add(randomIndex);
        selected.push(allQuestions[randomIndex]);
      }
    }
    
    setGeneratedQuestions(selected);
  };

  const copyQuestionText = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      const button = event.target;
      const originalText = button.textContent;
      button.textContent = '✓';
      setTimeout(() => {
        button.textContent = originalText;
      }, 1000);
    }).catch(() => {
      alert('복사에 실패했습니다.');
    });
  };

  const renderQuestion = (question, index) => {
    const renderJapaneseWithFurigana = () => {
      if (question.furigana) {
        // 후리가나가 있는 경우 루비 태그 사용
        const parts = question.jp.split(/([一-龯]+)/g);
        const furiganaParts = question.furigana.split(/([ぁ-ん]+)/g);
        
        return (
          <ruby>
            {question.jp}
            <rt style={{ fontSize: '0.5em', color: 'rgba(102, 126, 234, 0.7)' }}>
              {question.furigana}
            </rt>
          </ruby>
        );
      }
      return question.jp;
    };

    return (
      <div key={index} className="question-display" style={{ marginBottom: '15px' }}>
        <button 
          className="copy-button" 
          onClick={() => copyQuestionText(question.jp)}
        >
          복사
        </button>
        <div className="question-text" style={{ fontSize: '1.3rem' }}>
          {renderJapaneseWithFurigana()}
        </div>
        <div style={{ 
          fontSize: '1rem', 
          color: '#666', 
          textAlign: 'center', 
          marginTop: '8px' 
        }}>
          {question.kr}
        </div>
      </div>
    );
  };

  return (
    <div id="generator" className="tab-content active">
      <h2>질문 생성기</h2>
      
      {/* 주차별 의문문 */}
      <div className="generator-area">
        <h3>주차별 의문문 생성</h3>
        <select 
          className="category-dropdown" 
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">카테고리를 선택하세요</option>
          {Object.keys(allSentences).map(category => (
            <option key={category} value={category}>
              {category}
              {category.includes('N3') && <span> (N3)</span>}
            </option>
          ))}
        </select>
        <button 
          className="action-btn btn-primary" 
          onClick={generateCategoryQuestions}
        >
          선택한 카테고리에서 생성 (최대 5개)
        </button>
      </div>

      {/* 랜덤 의문문 */}
      <div className="generator-area" style={{ marginTop: '20px' }}>
        <h3>랜덤 의문문 생성</h3>
        <button 
          className="action-btn btn-secondary" 
          onClick={generateRandomQuestions}
        >
          모든 카테고리에서 랜덤 생성 (10개)
        </button>
      </div>

      {/* 생성된 질문 표시 */}
      {generatedQuestions.length > 0 && (
        <div style={{ marginTop: '25px' }}>
          <h3 style={{ marginBottom: '20px', color: '#333' }}>
            생성된 의문문 ({generatedQuestions.length}개)
          </h3>
          <div className="questions-container">
            {generatedQuestions.map((question, index) => renderQuestion(question, index))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleQuestionGenerator;