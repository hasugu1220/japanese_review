import React from 'react';

const ProgressBar = ({ current, total }) => {
  const percentage = total > 0 ? (current / total) * 100 : 0;
  
  return (
    <div className="quiz-progress-bar">
      <div 
        className="quiz-progress-fill" 
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

export default ProgressBar;