import React, { useState, useEffect } from 'react';
import { getAllWords } from '../data/vocabularyData';
import '../styles/WordQuizTab.css';

function WordQuizTab() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [totalQuestions] = useState(50);
  const [quizLevel, setQuizLevel] = useState('random');
  const [quizSet, setQuizSet] = useState(0); // 0 = all, 1-20 = set number
  const [wrongAnswers, setWrongAnswers] = useState(() => {
    const saved = localStorage.getItem('wrongAnswers');
    return saved ? JSON.parse(saved) : [];
  });

  // Generate quiz questions
  useEffect(() => {
    // Reset quiz set when changing level
    if (quizLevel === 'random' || quizLevel === 'wrong') {
      setQuizSet(0);
    } else {
      const maxSets = Math.ceil(getAllWords(quizLevel).length / 50);
      if (quizSet > maxSets) {
        setQuizSet(0);
      }
    }
    generateQuestions();
  }, [quizLevel]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    generateQuestions();
  }, [quizSet]); // eslint-disable-line react-hooks/exhaustive-deps

  const generateQuestions = () => {
    // Get words based on quiz level
    let sourceWords = [];
    
    if (quizLevel === 'wrong') {
      sourceWords = wrongAnswers;
      if (sourceWords.length === 0) {
        alert('틀린 단어가 없습니다!');
        return;
      }
    } else if (quizLevel === 'random') {
      sourceWords = getAllWords();
    } else {
      sourceWords = getAllWords(quizLevel);
      
      // Apply quiz set filter if not 'all' (0)
      if (quizSet > 0) {
        const setSize = 50;
        const startIdx = (quizSet - 1) * setSize;
        const endIdx = startIdx + setSize;
        sourceWords = sourceWords.slice(startIdx, endIdx);
        
        if (sourceWords.length === 0) {
          setQuizSet(0);
          return;
        }
      }
    }
    
    const allWords = sourceWords.map(word => ({
      ...word,
      category: word.category || 'general'
    }));

    // Shuffle and select questions
    const shuffled = [...allWords].sort(() => Math.random() - 0.5);
    const questionWords = shuffled.slice(0, Math.min(totalQuestions, shuffled.length));
    
    const quizQuestions = questionWords.map(word => {
      // Get wrong options
      const wrongOptions = allWords
        .filter(w => w.jp !== word.jp)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map(w => w.kr);
      
      // Mix correct answer with wrong options
      const options = [word.kr, ...wrongOptions].sort(() => Math.random() - 0.5);
      const correctIndex = options.indexOf(word.kr);
      
      return {
        word: word.jp,
        furigana: word.furigana,
        correctAnswer: word.kr,
        options,
        correctIndex
      };
    });
    
    setQuestions(quizQuestions);
    if (quizQuestions.length > 0) {
      setCurrentQuestion(quizQuestions[0]);
    }
  };

  const selectAnswer = (index) => {
    if (showResult) return;
    
    setSelectedAnswer(index);
    setShowResult(true);
    
    if (index === currentQuestion.correctIndex) {
      setScore(score + 1);
    } else {
      // Add to wrong answers if not already there
      const wrongWord = {
        jp: currentQuestion.word,
        kr: currentQuestion.correctAnswer,
        furigana: currentQuestion.furigana
      };
      if (!wrongAnswers.some(w => w.jp === wrongWord.jp)) {
        const newWrongAnswers = [...wrongAnswers, wrongWord];
        setWrongAnswers(newWrongAnswers);
        localStorage.setItem('wrongAnswers', JSON.stringify(newWrongAnswers));
      }
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

  const deleteWrongAnswer = (wordJp) => {
    const newWrongAnswers = wrongAnswers.filter(w => w.jp !== wordJp);
    setWrongAnswers(newWrongAnswers);
    localStorage.setItem('wrongAnswers', JSON.stringify(newWrongAnswers));
    if (quizLevel === 'wrong') {
      generateQuestions();
    }
  };

  const deleteAllWrongAnswers = () => {
    setWrongAnswers([]);
    localStorage.removeItem('wrongAnswers');
    if (quizLevel === 'wrong') {
      generateQuestions();
    }
  };

  if (!currentQuestion) {
    return <div className="loading">퀴즈를 준비중입니다...</div>;
  }

  return (
    <div className="word-quiz-tab">
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
        <button 
          className={`level-btn ${quizLevel === 'wrong' ? 'active' : ''}`}
          onClick={() => setQuizLevel('wrong')}
          style={{whiteSpace: 'nowrap'}}
        >
          틀린<br/>단어
        </button>
      </div>
      
      {(quizLevel === 'n3' || quizLevel === 'n4' || quizLevel === 'n5') && (
        <div className="quiz-set-selector" style={{display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '10px'}}>
          <button 
            className={`set-btn ${quizSet === 0 ? 'active' : ''}`}
            onClick={() => setQuizSet(0)}
            style={{padding: '5px 10px', fontSize: '12px', border: '1px solid #ddd', borderRadius: '4px', background: quizSet === 0 ? '#7c3aed' : 'white', color: quizSet === 0 ? 'white' : '#333'}}
          >
            전체
          </button>
          {Array.from({length: Math.ceil(getAllWords(quizLevel).length / 50)}, (_, i) => i + 1).map((setNum) => {
            const startNum = (setNum - 1) * 50 + 1;
            const endNum = setNum * 50;
            return (
              <button 
                key={setNum}
                className={`set-btn ${quizSet === setNum ? 'active' : ''}`}
                onClick={() => setQuizSet(setNum)}
                style={{padding: '5px 10px', fontSize: '12px', border: '1px solid #ddd', borderRadius: '4px', background: quizSet === setNum ? '#7c3aed' : 'white', color: quizSet === setNum ? 'white' : '#333'}}
              >
                세트{setNum} ({startNum}-{endNum})
              </button>
            );
          })}
        </div>
      )}
      
      {quizLevel === 'wrong' && (
        wrongAnswers.length > 0 ? (
          <div className="wrong-answers-controls">
            <button className="compact-action-btn" style={{marginBottom: '10px'}} onClick={deleteAllWrongAnswers}>
              전체 삭제
            </button>
            <div className="wrong-answers-grid" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '10px', maxHeight: '400px', overflowY: 'auto', marginBottom: '20px'}}>
              {wrongAnswers.map((word, index) => (
                <div 
                  key={word.jp} 
                  className="wrong-answer-card"
                  onClick={() => deleteWrongAnswer(word.jp)}
                  style={{
                    background: 'linear-gradient(135deg, #ef4444 0%, #f87171 100%)',
                    color: 'white',
                    padding: '12px',
                    borderRadius: '10px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(239, 68, 68, 0.2)',
                    transition: 'all 0.3s'
                  }}
                >
                  <div style={{fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '4px'}}>{word.jp}</div>
                  <div style={{fontSize: '0.85rem', opacity: 0.9}}>{word.kr}</div>
                  {word.furigana && <div style={{fontSize: '0.7rem', opacity: 0.8, marginTop: '3px'}}>{word.furigana}</div>}
                  <div style={{fontSize: '0.7rem', opacity: 0.6, marginTop: '3px'}}>탭하여 삭제</div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="empty-message" style={{textAlign: 'center', padding: '30px', color: '#9ca3af'}}>
            틀린 단어가 없습니다.
          </div>
        )
      )}
      
      {quizLevel !== 'wrong' && currentQuestion && (
        <>
          <div className="quiz-card">
            <div className="quiz-question">
              {currentQuestion.word}
            </div>
            
            <div className="quiz-options">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  className={`quiz-option ${
                    showResult && index === currentQuestion.correctIndex ? 'correct' : ''
                  } ${
                    showResult && index === selectedAnswer && index !== currentQuestion.correctIndex ? 'wrong' : ''
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
                  정답: {currentQuestion.correctAnswer}
                </div>
                {currentQuestion.furigana && (
                  <div className="quiz-answer-furigana">
                    {currentQuestion.furigana}
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="quiz-progress">
            {currentQuestionIndex + 1} / {totalQuestions}
          </div>
          
          <div className="quiz-score">
            점수: {score} / {totalQuestions}
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
        </>
      )}
    </div>
  );
}

export default WordQuizTab;