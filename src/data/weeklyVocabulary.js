// 주차별 단어 데이터 - 날짜별로 쉽게 업데이트 가능한 구조
export const weeklyVocabulary = {
  '2024-W1': {
    date: '1월 1주차',
    categories: {
      '지시어': [
        { jp: 'これ', kr: '이것', furigana: null },
        { jp: 'それ', kr: '그것', furigana: null },
        { jp: 'あれ', kr: '저것', furigana: null },
        { jp: 'ここ', kr: '여기', furigana: null },
        { jp: 'そこ', kr: '거기', furigana: null },
        { jp: 'あそこ', kr: '저기', furigana: null },
        { jp: 'どこ', kr: '어디', furigana: null }
      ],
      '대명사': [
        { jp: '私', kr: '저/나', furigana: 'わたし' },
        { jp: '俺', kr: '나(남자용)', furigana: 'おれ' },
        { jp: '僕', kr: '나(남자용)', furigana: 'ぼく' },
        { jp: 'あなた', kr: '당신', furigana: null },
        { jp: '君', kr: '너', furigana: 'きみ' },
        { jp: '彼', kr: '그', furigana: 'かれ' },
        { jp: '彼女', kr: '그녀', furigana: 'かのじょ' },
        { jp: '誰', kr: '누구', furigana: 'だれ' },
        { jp: 'みんな', kr: '모두', furigana: null }
      ]
    }
  },
  '2024-W2': {
    date: '1월 2주차',
    categories: {
      '동사': [
        { jp: '食べる', kr: '먹다', furigana: 'たべる' },
        { jp: '飲む', kr: '마시다', furigana: 'のむ' },
        { jp: '寝る', kr: '자다', furigana: 'ねる' },
        { jp: '見る', kr: '보다', furigana: 'みる' },
        { jp: '行く', kr: '가다', furigana: 'いく' },
        { jp: '来る', kr: '오다', furigana: 'くる' },
        { jp: 'する', kr: '하다', furigana: null },
        { jp: '言う', kr: '말하다', furigana: 'いう' },
        { jp: '会う', kr: '만나다', furigana: 'あう' },
        { jp: '読む', kr: '읽다', furigana: 'よむ' },
        { jp: '着る', kr: '입다', furigana: 'きる' },
        { jp: '出る', kr: '나오다', furigana: 'でる' },
        { jp: '持つ', kr: '갖다/들다', furigana: 'もつ' },
        { jp: '乗る', kr: '타다', furigana: 'のる' },
        { jp: '買う', kr: '사다', furigana: 'かう' },
        { jp: '聞く', kr: '듣다', furigana: 'きく' },
        { jp: '遊ぶ', kr: '놀다', furigana: 'あそぶ' },
        { jp: '降りる', kr: '내리다', furigana: 'おりる' },
        { jp: '書く', kr: '쓰다', furigana: 'かく' },
        { jp: '売る', kr: '팔다', furigana: 'うる' }
      ]
    }
  },
  '2024-W3': {
    date: '1월 3주차',
    categories: {
      'い형용사': [
        { jp: '美味しい', kr: '맛있다', furigana: 'おいしい' },
        { jp: '面白い', kr: '재밌다', furigana: 'おもしろい' },
        { jp: '痛い', kr: '아프다', furigana: 'いたい' },
        { jp: 'かわいい', kr: '귀엽다', furigana: null },
        { jp: 'かっこいい', kr: '멋있다', furigana: null },
        { jp: '寒い', kr: '춥다', furigana: 'さむい' },
        { jp: '暑い', kr: '덥다', furigana: 'あつい' },
        { jp: '忙しい', kr: '바쁘다', furigana: 'いそがしい' },
        { jp: '暖かい', kr: '따뜻하다', furigana: 'あたたかい' },
        { jp: '冷たい', kr: '차갑다', furigana: 'つめたい' },
        { jp: '新しい', kr: '새롭다', furigana: 'あたらしい' },
        { jp: '古い', kr: '오래되다', furigana: 'ふるい' },
        { jp: '高い', kr: '높다/비싸다', furigana: 'たかい' },
        { jp: '安い', kr: '싸다', furigana: 'やすい' },
        { jp: '大きい', kr: '크다', furigana: 'おおきい' },
        { jp: '小さい', kr: '작다', furigana: 'ちいさい' }
      ],
      'な형용사': [
        { jp: '好き', kr: '좋아하다', furigana: 'すき' },
        { jp: '嫌い', kr: '싫어하다', furigana: 'きらい' },
        { jp: 'きれい', kr: '아름답다/깨끗하다', furigana: null },
        { jp: '静か', kr: '조용하다', furigana: 'しずか' },
        { jp: '安全', kr: '안전하다', furigana: 'あんぜん' },
        { jp: '有名', kr: '유명하다', furigana: 'ゆうめい' },
        { jp: '大切', kr: '소중하다', furigana: 'たいせつ' },
        { jp: '簡単', kr: '쉽다/간단하다', furigana: 'かんたん' },
        { jp: '便利', kr: '편리하다', furigana: 'べんり' },
        { jp: '元気', kr: '건강하다/활기차다', furigana: 'げんき' }
      ]
    }
  },
  '2024-W4': {
    date: '1월 4주차',
    categories: {
      '음식': [
        { jp: 'ビール', kr: '맥주', furigana: null },
        { jp: 'コーヒー', kr: '커피', furigana: null },
        { jp: 'ご飯', kr: '밥', furigana: 'ごはん' },
        { jp: '焼き鳥', kr: '야키토리', furigana: 'やきとり' },
        { jp: '串カツ', kr: '꼬치튀김', furigana: 'くしカツ' },
        { jp: '唐揚げ', kr: '가라아게/치킨', furigana: 'からあげ' },
        { jp: '枝豆', kr: '에다마메', furigana: 'えだまめ' },
        { jp: 'お酒', kr: '술', furigana: 'おさけ' },
        { jp: '焼肉', kr: '야키니쿠', furigana: 'やきにく' },
        { jp: '牛乳', kr: '우유', furigana: 'ぎゅうにゅう' },
        { jp: 'ラーメン', kr: '라멘', furigana: null },
        { jp: '寿司', kr: '스시', furigana: 'すし' },
        { jp: '天ぷら', kr: '텐푸라', furigana: 'てんぷら' },
        { jp: 'うどん', kr: '우동', furigana: null },
        { jp: 'そば', kr: '소바', furigana: null }
      ],
      '과일': [
        { jp: 'りんご', kr: '사과', furigana: null },
        { jp: '苺', kr: '딸기', furigana: 'いちご' },
        { jp: '西瓜', kr: '수박', furigana: 'すいか' },
        { jp: '葡萄', kr: '포도', furigana: 'ぶどう' },
        { jp: '桃', kr: '복숭아', furigana: 'もも' },
        { jp: 'メロン', kr: '멜론', furigana: null },
        { jp: 'バナナ', kr: '바나나', furigana: null },
        { jp: 'みかん', kr: '귤', furigana: null },
        { jp: '梨', kr: '배', furigana: 'なし' },
        { jp: '柿', kr: '감', furigana: 'かき' }
      ]
    }
  }
};

// 모든 단어를 하나로 합친 데이터 (기존 호환성 유지)
export const getAllVocabulary = () => {
  const allVocab = {};
  
  Object.values(weeklyVocabulary).forEach(week => {
    Object.entries(week.categories).forEach(([category, words]) => {
      if (!allVocab[category]) {
        allVocab[category] = [];
      }
      allVocab[category].push(...words);
    });
  });
  
  return allVocab;
};

// 특정 주차의 단어 가져오기
export const getWeekVocabulary = (weekId) => {
  return weeklyVocabulary[weekId]?.categories || {};
};