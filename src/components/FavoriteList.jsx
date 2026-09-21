function FavoriteList({ favorites, onRemove }) {
  return (
    <section className="favorite-list" aria-labelledby="favorite-heading">
      <h2 id="favorite-heading">마음에 드는 명언</h2>

      {favorites.length === 0 ? (
        <p className="empty-message">아직 저장한 명언이 없어요.</p>
      ) : (
        <ul>
          {favorites.map((favoriteItem) => (
            <li key={favoriteItem.quote} className="favorite-item">
              <blockquote>
                <p>“{favoriteItem.quote}”</p>
                <footer>
                  <cite>— {favoriteItem.author}</cite>
                </footer>
              </blockquote>
              <button
                type="button"
                className="remove-button"
                onClick={() => onRemove(favoriteItem.quote)}
              >
                삭제
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default FavoriteList;
