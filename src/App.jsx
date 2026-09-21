import { useState } from 'react';
import QuoteCard from './components/QuoteCard.jsx';
import SearchBar from './components/SearchBar.jsx';
import FavoriteList from './components/FavoriteList.jsx';
import LanguageSelect from './components/LanguageSelect.jsx';
import quotes from './data/quotes.js';

const FAVORITE_STORAGE_KEY = 'favorite-quotes';

function loadFavorites() {
  const savedText = localStorage.getItem(FAVORITE_STORAGE_KEY);

  if (!savedText) {
    return [];
  }

  try {
    return JSON.parse(savedText);
  } catch (error) {
    return [];
  }
}

function saveFavorites(nextFavorites) {
  localStorage.setItem(FAVORITE_STORAGE_KEY, JSON.stringify(nextFavorites));
}

// 검색어와 맞는 명언만 골라냅니다.
function findQuotesByTopic(topic) {
  const searchText = topic.trim();

  if (searchText === '') {
    return quotes;
  }

  return quotes.filter((quoteItem) => {
    const matchesQuote = quoteItem.quote.includes(searchText);
    const matchesAuthor = quoteItem.author.includes(searchText);
    const matchesTopic = quoteItem.topics.some((topicWord) =>
      topicWord.includes(searchText)
    );

    return matchesQuote || matchesAuthor || matchesTopic;
  });
}

// 현재 명언과 다른 명언을 무작위로 고릅니다.
function getRandomQuote(quoteList, currentQuote) {
  const otherQuotes = quoteList.filter((quoteItem) => quoteItem !== currentQuote);
  const quotesToUse = otherQuotes.length > 0 ? otherQuotes : quoteList;
  const randomIndex = Math.floor(Math.random() * quotesToUse.length);

  return quotesToUse[randomIndex];
}

function App() {
  const [searchText, setSearchText] = useState('');
  const [activeTopic, setActiveTopic] = useState('');
  const [matchedQuotes, setMatchedQuotes] = useState(quotes);
  const [currentQuote, setCurrentQuote] = useState(quotes[0]);
  const [favorites, setFavorites] = useState(loadFavorites);
  const [selectedLanguage, setSelectedLanguage] = useState('ko');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiErrorMessage, setAiErrorMessage] = useState('');
  // key가 바뀌면 페이드 인 애니메이션이 다시 시작됩니다.
  const [animationKey, setAnimationKey] = useState(0);

  function showQuoteFromList(quoteList) {
    const nextQuote = getRandomQuote(quoteList, currentQuote);
    setCurrentQuote(nextQuote);
    setAnimationKey((previousKey) => previousKey + 1);
  }

  function handleSearch() {
    const nextMatchedQuotes = findQuotesByTopic(searchText);
    const nextTopic = searchText.trim();

    setActiveTopic(nextTopic);
    setMatchedQuotes(nextMatchedQuotes);

    if (nextMatchedQuotes.length > 0) {
      showQuoteFromList(nextMatchedQuotes);
    }
  }

  function handleNewQuote() {
    showQuoteFromList(matchedQuotes);
  }

  async function handleGenerateAiQuote() {
    setIsGenerating(true);
    setAiErrorMessage('');

    try {
      const response = await fetch('/api/generate-quote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          language: selectedLanguage,
          topic: activeTopic,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setAiErrorMessage(result.message || '명언을 만들지 못했어요.');
        return;
      }

      setCurrentQuote({
        quote: result.quote,
        author: result.author,
      });
      setAnimationKey((previousKey) => previousKey + 1);
    } catch (error) {
      setAiErrorMessage('서버에 연결하지 못했어요. npm run dev로 실행 중인지 확인해 주세요.');
    } finally {
      setIsGenerating(false);
    }
  }

  function handleSaveQuote() {
    const alreadySaved = favorites.some(
      (favoriteItem) => favoriteItem.quote === currentQuote.quote
    );

    if (alreadySaved) {
      return;
    }

    const nextFavorites = [
      ...favorites,
      {
        quote: currentQuote.quote,
        author: currentQuote.author,
      },
    ];

    setFavorites(nextFavorites);
    saveFavorites(nextFavorites);
  }

  function handleRemoveFavorite(quoteText) {
    const nextFavorites = favorites.filter(
      (favoriteItem) => favoriteItem.quote !== quoteText
    );

    setFavorites(nextFavorites);
    saveFavorites(nextFavorites);
  }

  const hasNoResult = matchedQuotes.length === 0;
  const isCurrentQuoteSaved = favorites.some(
    (favoriteItem) => favoriteItem.quote === currentQuote.quote
  );
  const canUseAi = import.meta.env.DEV;

  return (
    <main className="app">
      <header className="app-header">
        <h1>오늘의 명언 생성기</h1>
        <p>
          {canUseAi
            ? '언어를 고른 뒤 AI로 명언을 만들거나, 저장된 문장에서 뽑아 보세요.'
            : '주제를 검색하거나 버튼을 눌러 명언을 뽑아 보세요.'}
        </p>
      </header>

      <SearchBar
        searchText={searchText}
        onSearchTextChange={setSearchText}
        onSearch={handleSearch}
      />

      {activeTopic !== '' && (
        <p className="topic-status">
          {hasNoResult
            ? `"${activeTopic}"에 맞는 명언을 찾지 못했어요.`
            : `"${activeTopic}"에 대한 명언 ${matchedQuotes.length}개`}
        </p>
      )}

      {canUseAi ? (
        <LanguageSelect
          selectedLanguage={selectedLanguage}
          onLanguageChange={setSelectedLanguage}
        />
      ) : (
        <p className="empty-message">
          AI 명언 생성은 로컬에서 npm run dev로 실행할 때 사용할 수 있어요.
        </p>
      )}

      {aiErrorMessage !== '' && <p className="error-message">{aiErrorMessage}</p>}

      {hasNoResult ? (
        <p className="empty-message">다른 주제로 다시 검색해 보세요. AI 명언은 계속 만들 수 있어요.</p>
      ) : null}

      <QuoteCard
        key={animationKey}
        quote={currentQuote.quote}
        author={currentQuote.author}
        onNewQuote={handleNewQuote}
        onSaveQuote={handleSaveQuote}
        onGenerateAiQuote={handleGenerateAiQuote}
        canChangeQuote={!hasNoResult && matchedQuotes.length > 1}
        isSaved={isCurrentQuoteSaved}
        isGenerating={isGenerating}
        canUseAi={canUseAi}
      />

      <FavoriteList favorites={favorites} onRemove={handleRemoveFavorite} />
    </main>
  );
}

export default App;
