import React from 'react';

const QuizResult = ({ score, total, onRestart }) => {
  const percentage = (score / total) * 100;
  
  const getGrade = () => {
    if (percentage >= 90) return { grade: 'S', text: '완벽합니다!' };
    if (percentage >= 80) return { grade: 'A', text: '훌륭합니다!' };
    if (percentage >= 70) return { grade: 'B', text: '잘했습니다!' };
    if (percentage >= 60) return { grade: 'C', text: '조금 더 노력하세요!' };
    return { grade: 'D', text: '더 공부가 필요해요!' };
  };

  const { grade, text } = getGrade();

  return (
    <div className="quiz-card">
      <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>퀴즈 완료!</h3>
      <div style={{ textAlign: 'center', fontSize: '1.3rem', marginBottom: '20px', fontWeight: 'bold' }}>
        최종 점수: {score}/{total} ({percentage.toFixed(1)}%)
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
        <small style={{ fontSize: '1rem', marginTop: '5px', display: 'block' }}>{text}</small>
      </div>
      <button className="action-btn btn-primary" onClick={onRestart}>다시 도전</button>
    </div>
  );
};

export default QuizResult;