function SearchBar({ searchText, onSearchTextChange, onSearch }) {
  function handleSubmit(event) {
    event.preventDefault();
    onSearch();
  }

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <label htmlFor="topic-search" className="search-label">
        주제로 명언 찾기
      </label>
      <div className="search-row">
        <input
          id="topic-search"
          type="search"
          value={searchText}
          onChange={(event) => onSearchTextChange(event.target.value)}
          placeholder="예: 사랑, 용기, 시간, 믿음"
          autoComplete="off"
        />
        <button type="submit" className="search-button">
          검색
        </button>
      </div>
    </form>
  );
}

export default SearchBar;
