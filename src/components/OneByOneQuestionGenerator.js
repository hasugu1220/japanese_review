import React, { useState } from 'react';
import { reorganizedSentences } from '../data/reorganizedSentences';

const OneByOneQuestionGenerator = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [usedQuestions, setUsedQuestions] = useState([]);

  // 주차별 의문문 생성 (하나씩)
  const generateCategoryQuestion = () => {
    if (!selectedCategory) {
      alert('카테고리를 선택해주세요.');
      return;
    }

    const items = reorganizedSentences[selectedCategory] || [];
    const questions = items.filter(item => 
      item.jp.endsWith('？') || item.jp.endsWith('?')
    );

    if (questions.length === 0) {
      alert('선택한 카테고리에 의문문이 없습니다.');
      return;
    }

    // 사용하지 않은 질문 찾기
    const availableQuestions = questions.filter(q => 
      !usedQuestions.find(used => used.jp === q.jp && used.category === selectedCategory)
    );

    // 모든 질문을 사용했으면 초기화
    if (availableQuestions.length === 0) {
      setUsedQuestions(usedQuestions.filter(q => q.category !== selectedCategory));
      const randomIndex = Math.floor(Math.random() * questions.length);
      setCurrentQuestion({ ...questions[randomIndex], category: selectedCategory });
    } else {
      const randomIndex = Math.floor(Math.random() * availableQuestions.length);
      const selected = { ...availableQuestions[randomIndex], category: selectedCategory };
      setCurrentQuestion(selected);
      setUsedQuestions([...usedQuestions, selected]);
    }
  };

  // 랜덤 의문문 생성 (하나씩)
  const generateRandomQuestion = () => {
    const allQuestions = [];
    
    Object.entries(reorganizedSentences).forEach(([category, items]) => {
      items.forEach(item => {
        if (item.jp.endsWith('？') || item.jp.endsWith('?')) {
          allQuestions.push({ ...item, category });
        }
      });
    });

    if (allQuestions.length === 0) {
      alert('의문문이 없습니다.');
      return;
    }

    const randomIndex = Math.floor(Math.random() * allQuestions.length);
    setCurrentQuestion(allQuestions[randomIndex]);
  };

  const copyQuestionText = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      const button = event.target;
      const originalText = button.textContent;
      button.textContent = '✓ 복사됨';
      button.style.background = '#22c55e';
      setTimeout(() => {
        button.textContent = originalText;
        button.style.background = '';
      }, 1500);
    }).catch(() => {
      alert('복사에 실패했습니다.');
    });
  };

  const renderQuestion = () => {
    if (!currentQuestion) return null;

    const renderJapaneseWithFurigana = () => {
      if (currentQuestion.furigana) {
        return (
          <ruby style={{ fontSize: '1.8rem' }}>
            {currentQuestion.jp}
            <rt style={{ fontSize: '0.5em', color: 'rgba(124, 58, 237, 0.7)' }}>
              {currentQuestion.furigana}
            </rt>
          </ruby>
        );
      }
      return <span style={{ fontSize: '1.8rem' }}>{currentQuestion.jp}</span>;
    };

    return (
      <div className="question-card-single">
        <div className="question-category-badge">
          {currentQuestion.category}
        </div>
        
        <div className="question-content">
          <div className="question-japanese">
            {renderJapaneseWithFurigana()}
          </div>
          
          <div className="question-korean">
            {currentQuestion.kr}
          </div>
        </div>

        <button 
          className="copy-btn-single" 
          onClick={() => copyQuestionText(currentQuestion.jp)}
        >
          복사하기
        </button>
      </div>
    );
  };

  return (
    <div id="generator" className="tab-content active">
      <h2 style={{ fontSize: '1.2rem', marginBottom: '20px', color: '#374151' }}>
        질문 생성기
      </h2>
      
      {/* 카테고리 선택 */}
      <div className="generator-section">
        <label style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: '8px', display: 'block' }}>
          주차별 카테고리
        </label>
        <select 
          className="category-select-single" 
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">카테고리를 선택하세요</option>
          {Object.keys(reorganizedSentences).map(category => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        
        <button 
          className="generate-btn-primary"
          onClick={generateCategoryQuestion}
          disabled={!selectedCategory}
        >
          카테고리에서 생성
        </button>
      </div>

      {/* 랜덤 생성 */}
      <div className="generator-section" style={{ marginTop: '16px' }}>
        <label style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: '8px', display: 'block' }}>
          전체 랜덤
        </label>
        <button 
          className="generate-btn-secondary"
          onClick={generateRandomQuestion}
        >
          랜덤 의문문 생성
        </button>
      </div>

      {/* 생성된 질문 표시 */}
      {currentQuestion && (
        <div className="generated-question-container">
          {renderQuestion()}
        </div>
      )}

      <style jsx>{`
        .generator-section {
          background: #f9fafb;
          padding: 16px;
          border-radius: 12px;
          margin-bottom: 12px;
        }

        .category-select-single {
          width: 100%;
          padding: 12px;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          font-size: 15px;
          background: white;
          margin-bottom: 12px;
          cursor: pointer;
        }

        .generate-btn-primary,
        .generate-btn-secondary {
          width: 100%;
          padding: 14px;
          border: none;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .generate-btn-primary {
          background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);
          color: white;
        }

        .generate-btn-primary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .generate-btn-secondary {
          background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%);
          color: white;
        }

        .generate-btn-primary:active:not(:disabled),
        .generate-btn-secondary:active {
          transform: scale(0.98);
        }

        .generated-question-container {
          margin-top: 24px;
          animation: slideIn 0.3s ease;
        }

        .question-card-single {
          background: white;
          border: 2px solid #e5e7eb;
          border-radius: 16px;
          padding: 24px;
          position: relative;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }

        .question-category-badge {
          position: absolute;
          top: -12px;
          left: 20px;
          background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);
          color: white;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }

        .question-content {
          text-align: center;
          padding: 20px 0;
        }

        .question-japanese {
          margin-bottom: 16px;
          line-height: 1.4;
          color: #111827;
          font-weight: 600;
        }

        .question-korean {
          font-size: 1.1rem;
          color: #6b7280;
          line-height: 1.5;
        }

        .copy-btn-single {
          width: 100%;
          padding: 12px;
          background: #f3f4f6;
          border: 2px solid #e5e7eb;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          color: #374151;
          cursor: pointer;
          transition: all 0.2s;
          margin-top: 16px;
        }

        .copy-btn-single:active {
          transform: scale(0.98);
          background: #e5e7eb;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default OneByOneQuestionGenerator;