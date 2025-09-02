import React from 'react';

const QuizOption = ({ option, isCorrect, isWrong, isAnswered, onClick }) => {
  const getClassName = () => {
    let className = 'quiz-option';
    if (isAnswered) {
      if (isCorrect) className += ' correct';
      if (isWrong) className += ' wrong';
    }
    return className;
  };

  return (
    <button 
      className={getClassName()}
      onClick={onClick}
      style={{ pointerEvents: isAnswered ? 'none' : 'auto' }}
    >
      {option}
    </button>
  );
};

export default QuizOption;