import React, { useState } from 'react';

const Header = ({ activeTab, onTabChange }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleTabClick = (tab) => {
    onTabChange(tab);
    setMenuOpen(false);
  };

  return (
    <>
      <div className="header">
        <h1>일본어 학습 프로그램 V6</h1>
        <button className="menu-btn" onClick={toggleMenu}>
          ☰ 메뉴
        </button>
        <div className={`menu-dropdown ${menuOpen ? 'show' : ''}`}>
          <div 
            className={`menu-item ${activeTab === 'vocabulary' ? 'active' : ''}`} 
            onClick={() => handleTabClick('vocabulary')}
          >
            단어장
          </div>
          <div 
            className={`menu-item ${activeTab === 'word-quiz' ? 'active' : ''}`} 
            onClick={() => handleTabClick('word-quiz')}
          >
            단어퀴즈
          </div>
          <div 
            className={`menu-item ${activeTab === 'sentence-quiz' ? 'active' : ''}`} 
            onClick={() => handleTabClick('sentence-quiz')}
          >
            문장퀴즈
          </div>
          <div 
            className={`menu-item ${activeTab === 'generator' ? 'active' : ''}`} 
            onClick={() => handleTabClick('generator')}
          >
            질문생성
          </div>
        </div>
      </div>
      <div 
        className={`overlay ${menuOpen ? 'show' : ''}`} 
        onClick={() => setMenuOpen(false)}
      />
    </>
  );
};

export default Header;