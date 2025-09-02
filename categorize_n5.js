const fs = require('fs');
const data = JSON.parse(fs.readFileSync('n5_extracted.json', 'utf8'));

const categorized = {
  동사: [],
  い형용사: [],
  な형용사: [],
  명사: [],
  부사기타: []
};

// N5 common na-adjectives
const naAdjectives = ['きれい', '元気', '便利', '大変', '大切', '大丈夫', '賑やか', '静か', 'ハンサム', '有名'];

// Categorize words
data.forEach(word => {
  const jp = word.jp;
  
  // Check for verbs (ends with る, う, く, ぐ, す, つ, ぬ, ぶ, む)
  if (jp.match(/[るうくぐすつぬぶむ]$/)) {
    // But exclude some words that aren't verbs
    if (!['ある日', 'いくつ', 'いつ', 'そっち', 'どっち'].includes(jp)) {
      categorized['동사'].push(word);
    } else {
      categorized['부사기타'].push(word);
    }
  }
  // Check for i-adjectives
  else if (jp.endsWith('い') && !naAdjectives.some(na => jp.includes(na))) {
    // Exclude some words that aren't adjectives
    if (!['きらい', 'いっぱい', 'たくさん'].includes(jp)) {
      categorized['い형용사'].push(word);
    } else {
      categorized['부사기타'].push(word);
    }
  }
  // Check for na-adjectives
  else if (naAdjectives.some(na => jp.includes(na))) {
    categorized['な형용사'].push(word);
  }
  // Adverbs and others
  else if (['また', 'まだ', 'もう', 'よく', 'たくさん', 'すこし', 'ちょっと', 'とても', 'あまり', 'ぜんぜん', 'いつも', 'ときどき', 'いっしょ'].includes(jp)) {
    categorized['부사기타'].push(word);
  }
  // Everything else is a noun
  else {
    categorized['명사'].push(word);
  }
});

// Print stats
Object.keys(categorized).forEach(cat => {
  console.log(`${cat}: ${categorized[cat].length} words`);
});

// Save to file
fs.writeFileSync('n5_categorized.json', JSON.stringify(categorized, null, 2));
console.log('Saved to n5_categorized.json');