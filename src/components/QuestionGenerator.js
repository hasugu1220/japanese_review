import React, { useState } from 'react';
import { sentences } from '../data/sentences';

const QuestionGenerator = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [generatedQuestion, setGeneratedQuestion] = useState('');

  const generateCategoryQuestion = () => {
    if (!selectedCategory) {
      alert('카테고리를 선택해주세요.');
      return;
    }

    const items = sentences[selectedCategory] || [];
    const questions = items.filter(item => 
      item.jp.endsWith('？') || item.jp.endsWith('?')
    );

    if (questions.length === 0) {
      alert('선택한 카테고리에 의문문이 없습니다.');
      return;
    }

    const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
    setGeneratedQuestion(randomQuestion.jp);
  };

  const generateRandomQuestion = () => {
    const allQuestions = [];
    
    Object.values(sentences).forEach(items => {
      items.forEach(item => {
        if (item.jp.endsWith('？') || item.jp.endsWith('?')) {
          allQuestions.push(item.jp);
        }
      });
    });

    if (allQuestions.length === 0) {
      alert('의문문이 없습니다.');
      return;
    }

    const randomQuestion = allQuestions[Math.floor(Math.random() * allQuestions.length)];
    setGeneratedQuestion(randomQuestion);
  };

  const copyQuestionText = () => {
    navigator.clipboard.writeText(generatedQuestion).then(() => {
      alert('복사되었습니다!');
    }).catch(() => {
      alert('복사에 실패했습니다.');
    });
  };

  return (
    <div id="generator" className="tab-content active">
      <h2>질문 생성기</h2>
      <div className="generator-area">
        <h3>카테고리별 의문문 생성</h3>
        <select 
          className="category-dropdown" 
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">카테고리를 선택하세요</option>
          {Object.keys(sentences).map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
        <button className="action-btn btn-primary" onClick={generateCategoryQuestion}>
          선택한 카테고리에서 생성
        </button>
        <hr style={{ margin: '15px 0' }} />
        <h3>랜덤 의문문 생성</h3>
        <button className="action-btn btn-secondary" onClick={generateRandomQuestion}>
          랜덤 의문문 생성
        </button>
      </div>
      {generatedQuestion && (
        <div className="question-display">
          <button className="copy-button" onClick={copyQuestionText}>복사</button>
          <div className="question-text">{generatedQuestion}</div>
        </div>
      )}
    </div>
  );
};

export default QuestionGenerator;