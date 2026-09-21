function QuoteCard({
  quote,
  author,
  onNewQuote,
  onSaveQuote,
  onGenerateAiQuote,
  canChangeQuote,
  isSaved,
  isGenerating,
  canUseAi,
}) {
  return (
    <article className="quote-card">
      <div className="quote-icon" aria-hidden="true">
        “
      </div>

      <blockquote className="quote-text">
        <p>“{quote}”</p>
        <footer>
          <cite>— {author}</cite>
        </footer>
      </blockquote>

      <div className="button-row">
        <button
          type="button"
          className="quote-button"
          onClick={onNewQuote}
          disabled={!canChangeQuote || isGenerating}
        >
          새로운 명언
        </button>
        {canUseAi ? (
          <button
            type="button"
            className="ai-button"
            onClick={onGenerateAiQuote}
            disabled={isGenerating}
          >
            {isGenerating ? '생성 중...' : 'AI 명언 생성'}
          </button>
        ) : null}
        <button
          type="button"
          className="save-button"
          onClick={onSaveQuote}
          disabled={isSaved || isGenerating}
        >
          {isSaved ? '저장됨' : '목록에 저장'}
        </button>
      </div>
    </article>
  );
}

export default QuoteCard;
