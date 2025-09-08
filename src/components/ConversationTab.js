import React, { useState } from 'react';
import { conversationData } from '../data/conversationData';
import '../styles/ConversationTab.css';

const ConversationTab = () => {
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [showFurigana, setShowFurigana] = useState(true);

  const handleLessonClick = (lesson) => {
    setSelectedLesson(lesson);
  };

  const handleBackClick = () => {
    setSelectedLesson(null);
  };

  if (selectedLesson) {
    return (
      <div className="conversation-container">
        <div className="conversation-header">
          <button className="back-btn" onClick={handleBackClick}>
            ← 목록으로
          </button>
          <div className="lesson-info">
            <h3>{selectedLesson.date}일 수업</h3>
            <h4>{selectedLesson.title}</h4>
          </div>
          <div className="furigana-toggle">
            <label>
              <input
                type="checkbox"
                checked={showFurigana}
                onChange={(e) => setShowFurigana(e.target.checked)}
              />
              후리가나 표시
            </label>
          </div>
        </div>

        <div className="conversation-cards">
          {selectedLesson.conversations.map((conv, index) => (
            <div key={index} className="conversation-card">
              <div className="conversation-korean">
                {conv.jp}
              </div>
              <div className="conversation-japanese">
                {conv.kr}
              </div>
              {showFurigana && conv.furigana && (
                <div className="conversation-furigana">
                  {conv.furigana}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="conversation-container">
      <div className="conversation-header">
        <h3>수업 대화문 모음</h3>
        <p>날짜를 선택하여 대화문을 확인하세요</p>
      </div>

      <div className="lesson-list">
        {conversationData.map((lesson) => (
          <div 
            key={lesson.id} 
            className="lesson-card"
            onClick={() => handleLessonClick(lesson)}
          >
            <div className="lesson-date">{lesson.date}일 수업</div>
            <div className="lesson-title">{lesson.title}</div>
            <div className="lesson-count">{lesson.conversations.length}개 대화문</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConversationTab;