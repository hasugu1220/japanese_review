import React from 'react';

const VocabCard = ({ japanese, korean, category, furigana }) => {
  const renderJapaneseWithFurigana = () => {
    if (furigana) {
      return (
        <ruby>
          {japanese}
          <rt style={{ fontSize: '0.6em' }}>{furigana}</rt>
        </ruby>
      );
    }
    return japanese;
  };

  return (
    <div className="vocab-card">
      <div className="japanese-text">
        {renderJapaneseWithFurigana()}
      </div>
      <div className="korean-text">{korean}</div>
      <div className="category-label">{category}</div>
    </div>
  );
};

export default VocabCard;