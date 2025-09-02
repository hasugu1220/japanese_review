import React, { useState, useEffect } from 'react';
import { sentenceQuizData } from '../data/sentenceQuizData';
import { enhancedSentenceQuizData } from '../data/enhancedSentenceQuizData';
import '../styles/SentenceQuizTab.css';

function SentenceQuizTab() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [quizLevel, setQuizLevel] = useState('random');

  // Generate questions based on level
  const generateQuestions = () => {
    let selectedQuestions = [];
    
    if (quizLevel === 'n5') {
      selectedQuestions = [...enhancedSentenceQuizData.n5];
    } else if (quizLevel === 'n4') {
      selectedQuestions = [...enhancedSentenceQuizData.n4];
    } else if (quizLevel === 'n3') {
      selectedQuestions = [...enhancedSentenceQuizData.n3];
    } else {
      // Random - mix all levels including original data
      selectedQuestions = [
        ...sentenceQuizData,
        ...enhancedSentenceQuizData.n5,
        ...enhancedSentenceQuizData.n4,
        ...enhancedSentenceQuizData.n3
      ];
    }
    
    // Shuffle and limit to 15 questions
    const shuffled = selectedQuestions.sort(() => Math.random() - 0.5).slice(0, 15);
    setQuestions(shuffled);
    if (shuffled.length > 0) {
      setCurrentQuestion(shuffled[0]);
    }
  };

  // Initialize quiz
  useEffect(() => {
    generateQuestions();
  }, [quizLevel]); // eslint-disable-line react-hooks/exhaustive-deps

  const selectAnswer = (index) => {
    if (showResult) return;
    
    setSelectedAnswer(index);
    setShowResult(true);
    
    if (index === currentQuestion.correct) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      setCurrentQuestion(questions[nextIndex]);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      // Quiz finished
      const percentage = Math.round((score / questions.length) * 100);
      alert(`퀴즈 완료! 점수: ${score}/${questions.length} (${percentage}%)`);
      // Reset quiz
      setCurrentQuestionIndex(0);
      setScore(0);
      generateQuestions();
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  if (!currentQuestion) {
    return <div className="loading">문장 퀴즈를 준비중입니다...</div>;
  }

  return (
    <div className="sentence-quiz-tab">
      <div className="quiz-level-selector">
        <button 
          className={`level-btn ${quizLevel === 'random' ? 'active' : ''}`}
          onClick={() => setQuizLevel('random')}
        >
          랜덤
        </button>
        <button 
          className={`level-btn ${quizLevel === 'n5' ? 'active' : ''}`}
          onClick={() => setQuizLevel('n5')}
        >
          N5
        </button>
        <button 
          className={`level-btn ${quizLevel === 'n4' ? 'active' : ''}`}
          onClick={() => setQuizLevel('n4')}
        >
          N4
        </button>
        <button 
          className={`level-btn ${quizLevel === 'n3' ? 'active' : ''}`}
          onClick={() => setQuizLevel('n3')}
        >
          N3
        </button>
      </div>

      <div className="quiz-card">
        <div className="quiz-question">
          {currentQuestion.question}
        </div>
        
        <div className="quiz-options">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              className={`quiz-option ${
                showResult && index === currentQuestion.correct ? 'correct' : ''
              } ${
                showResult && index === selectedAnswer && index !== currentQuestion.correct ? 'wrong' : ''
              }`}
              onClick={() => selectAnswer(index)}
              disabled={showResult}
            >
              {option}
            </button>
          ))}
        </div>
        
        {showResult && (
          <div className="quiz-result">
            <div className="quiz-answer-display">
              정답: {currentQuestion.korean}
            </div>
            {currentQuestion.hiragana && (
              <div className="quiz-answer-furigana">
                {currentQuestion.hiragana}
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="quiz-progress">
        {currentQuestionIndex + 1} / {questions.length}
      </div>
      
      <div className="quiz-score">
        점수: {score} / {questions.length}
      </div>
      
      <div className="quiz-controls">
        <button 
          className="quiz-control-btn" 
          onClick={nextQuestion}
          disabled={!showResult}
        >
          다음 문제
        </button>
      </div>
    </div>
  );
}

export default SentenceQuizTab;