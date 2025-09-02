import React, { useState } from 'react';
import { vocabularyByPOS } from '../data/vocabularyByPOS';

const WordQuiz = () => {
  const [quizData, setQuizData] = useState([]);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [currentScore, setCurrentScore] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);

  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const beginQuiz = () => {
    const allWords = [];
    Object.keys(vocabularyByPOS).forEach(category => {
      vocabularyByPOS[category].forEach(word => {
        allWords.push({
          question: `"${word.jp}"의 뜻은?`,
          answer: word.kr,
          japanese: word.jp,
          furigana: word.furigana
        });
      });
    });

    const newQuizData = [];
    const usedIndices = [];

    for (let i = 0; i < Math.min(10, allWords.length); i++) {
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * allWords.length);
      } while (usedIndices.includes(randomIndex));
      
      usedIndices.push(randomIndex);
      const word = allWords[randomIndex];
      
      const wrongAnswers = [];
      while (wrongAnswers.length < 3) {
        const wrongIndex = Math.floor(Math.random() * allWords.length);
        const wrongWord = allWords[wrongIndex];
        
        if (wrongWord.answer !== word.answer && !wrongAnswers.includes(wrongWord.answer)) {
          wrongAnswers.push(wrongWord.answer);
        }
      }
      
      const options = shuffleArray([word.answer, ...wrongAnswers]);
      
      newQuizData.push({
        question: word.question,
        options: options,
        correct: word.answer,
        explanation: `${word.japanese} = ${word.answer}`
      });
    }

    setQuizData(newQuizData);
    setCurrentQuizIndex(0);
    setCurrentScore(0);
    setIsAnswered(false);
    setQuizStarted(true);
  };

  const chooseAnswer = (selected) => {
    if (isAnswered) return;
    setIsAnswered(true);

    const question = quizData[currentQuizIndex];
    
    if (selected === question.correct) {
      setCurrentScore(currentScore + 1);
    }

    setTimeout(() => {
      setCurrentQuizIndex(currentQuizIndex + 1);
      setIsAnswered(false);
    }, 2000);
  };

  const renderQuizContent = () => {
    if (!quizStarted) {
      return (
        <div className="quiz-card">
          <p style={{ textAlign: 'center', fontSize: '1rem', color: '#666', marginBottom: '20px', lineHeight: 1.5 }}>
            단어 실력을 테스트해보세요!<br/>총 10문제가 출제됩니다.
          </p>
          <button className="action-btn btn-primary" onClick={beginQuiz}>퀴즈 시작</button>
        </div>
      );
    }

    if (currentQuizIndex >= quizData.length) {
      const percentage = (currentScore / quizData.length) * 100;
      let grade, gradeText;

      if (percentage >= 90) {
        grade = 'S'; gradeText = '완벽합니다!';
      } else if (percentage >= 80) {
        grade = 'A'; gradeText = '훌륭합니다!';
      } else if (percentage >= 70) {
        grade = 'B'; gradeText = '잘했습니다!';
      } else if (percentage >= 60) {
        grade = 'C'; gradeText = '조금 더 노력하세요!';
      } else {
        grade = 'D'; gradeText = '더 공부가 필요해요!';
      }

      return (
        <div className="quiz-card">
          <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>퀴즈 완료!</h3>
          <div style={{ textAlign: 'center', fontSize: '1.3rem', marginBottom: '20px', fontWeight: 'bold' }}>
            최종 점수: {currentScore}/{quizData.length} ({percentage.toFixed(1)}%)
          </div>
          <div style={{ 
            textAlign: 'center', 
            fontSize: '1.5rem', 
            fontWeight: 'bold', 
            padding: '20px', 
            borderRadius: '15px', 
            color: 'white', 
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', 
            margin: '20px 0' 
          }}>
            등급: {grade}<br/>
            <small style={{ fontSize: '1rem', marginTop: '5px', display: 'block' }}>{gradeText}</small>
          </div>
          <button className="action-btn btn-primary" onClick={beginQuiz}>다시 도전</button>
        </div>
      );
    }

    const question = quizData[currentQuizIndex];
    
    return (
      <div className="quiz-card">
        <div style={{ textAlign: 'center', marginBottom: '15px', fontSize: '1rem', fontWeight: 'bold' }}>
          점수: {currentScore}/{quizData.length} | 문제 {currentQuizIndex + 1}/{quizData.length}
        </div>
        <div className="quiz-question">{question.question}</div>
        <div className="quiz-options">
          {question.options.map((option, index) => (
            <button 
              key={index}
              className={`quiz-option ${
                isAnswered && option === question.correct ? 'correct' : 
                isAnswered && option !== question.correct && document.activeElement?.textContent === option ? 'wrong' : ''
              }`}
              onClick={() => chooseAnswer(option)}
              style={{ pointerEvents: isAnswered ? 'none' : 'auto' }}
            >
              {option}
            </button>
          ))}
        </div>
        {isAnswered && (
          <div style={{ 
            background: '#e3f2fd', 
            borderLeft: '4px solid #2196f3', 
            padding: '15px', 
            marginTop: '15px', 
            borderRadius: '5px', 
            fontSize: '14px', 
            lineHeight: 1.5 
          }}>
            {question.explanation}
          </div>
        )}
      </div>
    );
  };

  return (
    <div id="word-quiz" className="tab-content active">
      <h2>단어퀴즈</h2>
      <div className="quiz-section">
        <div className="quiz-progress-bar">
          <div 
            className="quiz-progress-fill" 
            style={{ width: quizStarted ? `${(currentQuizIndex / quizData.length) * 100}%` : '0%' }}
          />
        </div>
        <div id="word-quiz-area">
          {renderQuizContent()}
        </div>
      </div>
    </div>
  );
};

export default WordQuiz;