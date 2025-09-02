import React, { useState } from 'react';
import { sentences } from '../data/sentences';
import { n3Sentences, questionPatterns } from '../data/n3Sentences';
import { getAllVocabulary } from '../data/weeklyVocabulary';

const EnhancedQuestionGenerator = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPattern, setSelectedPattern] = useState('');
  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  const [selectedN3Category, setSelectedN3Category] = useState('');

  // 기존 문장에서 의문문 생성
  const generateFromExistingSentences = () => {
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

    const selected = [];
    for (let i = 0; i < Math.min(3, questions.length); i++) {
      const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
      if (!selected.find(q => q.jp === randomQuestion.jp)) {
        selected.push(randomQuestion);
      }
    }
    
    setGeneratedQuestions(selected);
  };

  // N3 문장에서 의문문 생성
  const generateFromN3Sentences = () => {
    if (!selectedN3Category) {
      alert('N3 카테고리를 선택해주세요.');
      return;
    }

    const items = n3Sentences[selectedN3Category] || [];
    const questions = items.filter(item => 
      item.jp.endsWith('？') || item.jp.endsWith('?')
    );

    if (questions.length === 0) {
      alert('선택한 카테고리에 의문문이 없습니다.');
      return;
    }

    const selected = [];
    for (let i = 0; i < Math.min(3, questions.length); i++) {
      const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
      if (!selected.find(q => q.jp === randomQuestion.jp)) {
        selected.push(randomQuestion);
      }
    }
    
    setGeneratedQuestions(selected);
  };

  // 패턴 기반 의문문 생성
  const generateFromPattern = () => {
    if (!selectedPattern) {
      alert('패턴을 선택해주세요.');
      return;
    }

    const patterns = questionPatterns[selectedPattern] || [];
    const vocabulary = getAllVocabulary();
    const verbs = vocabulary['동사'] || [];
    
    const generated = [];
    
    patterns.forEach(pattern => {
      if (pattern.example) {
        generated.push({
          jp: pattern.example,
          kr: pattern.example.replace(/何を/, '무엇을')
            .replace(/どこで/, '어디서')
            .replace(/いつ/, '언제')
            .replace(/誰が/, '누가')
            .replace(/どうやって/, '어떻게')
            .replace(/なぜ/, '왜')
            .replace(/どちらが/, '어느 쪽이')
            .replace(/ますか？/, '합니까?')
            .replace(/ですか？/, '입니까?'),
          pattern: pattern.jp
        });
      }
    });

    // 동사를 활용한 추가 예문 생성
    if (verbs.length > 0 && patterns.length > 0) {
      const randomVerb = verbs[Math.floor(Math.random() * verbs.length)];
      const randomPattern = patterns[0];
      
      if (randomPattern.jp.includes('[動詞]')) {
        const verbStem = randomVerb.jp.replace(/る$/, '').replace(/む$/, 'み').replace(/く$/, 'き').replace(/う$/, 'い');
        const generatedSentence = randomPattern.jp.replace('[動詞]', verbStem);
        generated.push({
          jp: generatedSentence,
          kr: `${randomPattern.kr.replace('[동사]', randomVerb.kr)}`,
          pattern: randomPattern.jp
        });
      }
    }
    
    setGeneratedQuestions(generated);
  };

  // 랜덤 의문문 생성 (모든 소스에서)
  const generateRandomQuestions = () => {
    const allQuestions = [];
    
    // 기존 문장
    Object.values(sentences).forEach(items => {
      items.forEach(item => {
        if (item.jp.endsWith('？') || item.jp.endsWith('?')) {
          allQuestions.push(item);
        }
      });
    });

    // N3 문장
    Object.values(n3Sentences).forEach(items => {
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
    for (let i = 0; i < Math.min(5, allQuestions.length); i++) {
      const randomQuestion = allQuestions[Math.floor(Math.random() * allQuestions.length)];
      if (!selected.find(q => q.jp === randomQuestion.jp)) {
        selected.push(randomQuestion);
      }
    }
    
    setGeneratedQuestions(selected);
  };

  const copyQuestionText = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('복사되었습니다!');
    }).catch(() => {
      alert('복사에 실패했습니다.');
    });
  };

  const renderQuestion = (question, index) => {
    const renderJapaneseWithFurigana = () => {
      if (question.furigana) {
        return (
          <ruby>
            {question.jp}
            <rt style={{ fontSize: '0.5em', color: 'rgba(102, 126, 234, 0.7)' }}>{question.furigana}</rt>
          </ruby>
        );
      }
      return question.jp;
    };

    return (
      <div key={index} className="question-display" style={{ marginBottom: '10px' }}>
        <button 
          className="copy-button" 
          onClick={() => copyQuestionText(question.jp)}
        >
          복사
        </button>
        <div className="question-text">
          {renderJapaneseWithFurigana()}
        </div>
        <div style={{ 
          fontSize: '0.9rem', 
          color: '#666', 
          textAlign: 'center', 
          marginTop: '5px' 
        }}>
          {question.kr}
        </div>
        {question.pattern && (
          <div style={{ 
            fontSize: '0.8rem', 
            color: '#999', 
            textAlign: 'center', 
            marginTop: '3px',
            fontStyle: 'italic'
          }}>
            패턴: {question.pattern}
          </div>
        )}
      </div>
    );
  };

  return (
    <div id="generator" className="tab-content active">
      <h2>향상된 질문 생성기</h2>
      
      {/* 기존 문장 카테고리 */}
      <div className="generator-area">
        <h3>기존 카테고리별 의문문</h3>
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
        <button className="action-btn btn-primary" onClick={generateFromExistingSentences}>
          기존 카테고리에서 생성
        </button>
      </div>

      {/* N3 문장 카테고리 */}
      <div className="generator-area" style={{ marginTop: '15px' }}>
        <h3>N3 레벨 의문문</h3>
        <select 
          className="category-dropdown" 
          value={selectedN3Category}
          onChange={(e) => setSelectedN3Category(e.target.value)}
        >
          <option value="">N3 카테고리를 선택하세요</option>
          {Object.keys(n3Sentences).map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
        <button className="action-btn btn-primary" onClick={generateFromN3Sentences}>
          N3 카테고리에서 생성
        </button>
      </div>

      {/* 패턴 기반 생성 */}
      <div className="generator-area" style={{ marginTop: '15px' }}>
        <h3>패턴 기반 의문문 생성</h3>
        <select 
          className="category-dropdown" 
          value={selectedPattern}
          onChange={(e) => setSelectedPattern(e.target.value)}
        >
          <option value="">패턴을 선택하세요</option>
          <option value="what">무엇 (何)</option>
          <option value="where">어디 (どこ)</option>
          <option value="when">언제 (いつ)</option>
          <option value="who">누구 (誰)</option>
          <option value="how">어떻게 (どう)</option>
          <option value="why">왜 (なぜ)</option>
          <option value="which">어느 (どちら)</option>
          <option value="can">~할 수 있다 (できる)</option>
        </select>
        <button className="action-btn btn-primary" onClick={generateFromPattern}>
          패턴으로 생성
        </button>
      </div>

      {/* 랜덤 생성 */}
      <div className="generator-area" style={{ marginTop: '15px' }}>
        <h3>랜덤 의문문 생성</h3>
        <button className="action-btn btn-secondary" onClick={generateRandomQuestions}>
          모든 소스에서 랜덤 생성 (5개)
        </button>
      </div>

      {/* 생성된 질문 표시 */}
      {generatedQuestions.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h3 style={{ marginBottom: '15px' }}>생성된 의문문</h3>
          {generatedQuestions.map((question, index) => renderQuestion(question, index))}
        </div>
      )}
    </div>
  );
};

export default EnhancedQuestionGenerator;