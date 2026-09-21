const languageNames = {
  ko: '한국어',
  en: 'English',
  ja: '日本語',
  zh: '中文',
  es: 'Español',
};

const spanishWords = [
  'tiempo',
  'amor',
  'vida',
  'coraje',
  'esperanza',
  'fe',
  'paz',
  'perdon',
  'perdón',
  'felicidad',
  'sabiduria',
  'sabiduría',
  'verdad',
  'cambio',
  'aprendizaje',
  'honestidad',
  'humildad',
  'libertad',
  'sueno',
  'sueño',
  'educacion',
  'educación',
];

function detectSearchLanguage(text) {
  const trimmed = text.trim();

  if (trimmed === '') {
    return '';
  }

  if (/[가-힣]/.test(trimmed)) {
    return 'ko';
  }

  if (/[\u3040-\u30ff]/.test(trimmed)) {
    return 'ja';
  }

  if (/[áéíóúüñ¿¡]/i.test(trimmed)) {
    return 'es';
  }

  if (/[\u4e00-\u9fff]/.test(trimmed)) {
    if (/[时间学习勇气幸福希望智慧和平信仰爱情]/.test(trimmed)) {
      return 'zh';
    }

    return 'ja';
  }

  if (/^[a-zA-Z\s']+$/.test(trimmed)) {
    const lower = trimmed.toLowerCase();
    const looksSpanish = spanishWords.some(
      (word) => lower === word || lower.includes(word)
    );

    return looksSpanish ? 'es' : 'en';
  }

  return '';
}

function getSearchLanguage(searchText, selectedLanguage) {
  return detectSearchLanguage(searchText) || selectedLanguage;
}

export { languageNames, getSearchLanguage };
