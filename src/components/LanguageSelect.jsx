const languages = [
  { code: 'ko', label: '한국어' },
  { code: 'en', label: 'English' },
  { code: 'ja', label: '日本語' },
  { code: 'zh', label: '中文' },
  { code: 'es', label: 'Español' },
];

function LanguageSelect({ selectedLanguage, onLanguageChange }) {
  return (
    <fieldset className="language-select">
      <legend>AI 명언 언어</legend>
      <div className="language-options">
        {languages.map((languageItem) => (
          <label key={languageItem.code} className="language-option">
            <input
              type="radio"
              name="quote-language"
              value={languageItem.code}
              checked={selectedLanguage === languageItem.code}
              onChange={(event) => onLanguageChange(event.target.value)}
            />
            {languageItem.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export default LanguageSelect;
