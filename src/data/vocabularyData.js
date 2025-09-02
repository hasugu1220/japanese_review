// 통합된 단어 데이터 관리 파일
import { lessonVocabulary } from './lessonVocabulary';
import { n5VocabularyEnhanced } from './n5VocabularyEnhanced';
import { n4VocabularyEnhanced } from './n4VocabularyEnhanced';
import { n3VocabularyEnhanced } from './n3VocabularyEnhanced';

// 레벨별 단어 데이터
export const vocabularyData = {
  lesson: lessonVocabulary,
  n5: n5VocabularyEnhanced,
  n4: n4VocabularyEnhanced,
  n3: n3VocabularyEnhanced
};

// 레벨별 단어 수 가져오기
export const getVocabularyCount = (level) => {
  const vocab = vocabularyData[level];
  if (!vocab) return 0;
  
  return Object.values(vocab).reduce((total, category) => {
    return total + (Array.isArray(category) ? category.length : 0);
  }, 0);
};

// 모든 단어 가져오기
export const getAllWords = (level = null) => {
  const words = [];
  
  if (level && vocabularyData[level]) {
    const vocab = vocabularyData[level];
    Object.values(vocab).forEach(category => {
      if (Array.isArray(category)) {
        words.push(...category);
      }
    });
  } else {
    // 모든 레벨의 단어
    Object.values(vocabularyData).forEach(vocab => {
      Object.values(vocab).forEach(category => {
        if (Array.isArray(category)) {
          words.push(...category);
        }
      });
    });
  }
  
  return words;
};

// 카테고리별 단어 가져오기
export const getWordsByCategory = (level, category) => {
  const vocab = vocabularyData[level];
  if (!vocab || !vocab[category]) return [];
  return vocab[category];
};

// 레벨별 카테고리 목록 가져오기
export const getCategories = (level) => {
  const vocab = vocabularyData[level];
  if (!vocab) return [];
  return Object.keys(vocab);
};

// 퀴즈용 단어 세트 생성 (50개씩)
export const getQuizSet = (level, setNumber, setSize = 50) => {
  const allWords = getAllWords(level);
  const startIdx = (setNumber - 1) * setSize;
  const endIdx = startIdx + setSize;
  return allWords.slice(startIdx, endIdx);
};

// 퀴즈 세트 개수 계산
export const getQuizSetCount = (level, setSize = 50) => {
  const totalWords = getVocabularyCount(level);
  return Math.ceil(totalWords / setSize);
};