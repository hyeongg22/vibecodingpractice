function QuoteCard({
  quote,
  author,
  onNewQuote,
  onSaveQuote,
  canChangeQuote,
  isSaved,
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
          disabled={!canChangeQuote}
        >
          새로운 명언
        </button>
        <button
          type="button"
          className="save-button"
          onClick={onSaveQuote}
          disabled={isSaved}
        >
          {isSaved ? '저장됨' : '목록에 저장'}
        </button>
      </div>
    </article>
  );
}

export default QuoteCard;
