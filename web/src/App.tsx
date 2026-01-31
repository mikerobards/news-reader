// filepath: /Users/michaelrobards/Documents/Projects/ztm/vibe-coding/news-reader/web/src/App.tsx
import { useState, useEffect } from 'react'
import { HeadlinesList } from './components/HeadlinesList';
import { Article } from './lib/newsapi';
import './styles.css'
import { Menu } from 'lucide-react'; // Example icons if available, else text

function App() {
  const [category, setCategory] = useState('tech');
  const [searchQuery, setSearchQuery] = useState('');
  // We use a temp search state for input, apply it on Enter or Button
  const [searchInput, setSearchInput] = useState('');
  
  const [isFavoritesView, setIsFavoritesView] = useState(false);
  const [favorites, setFavorites] = useState<Article[]>(() => {
    const saved = localStorage.getItem('news_favorites');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Persist favorites
  useEffect(() => {
    localStorage.setItem('news_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (article: Article) => {
    setFavorites(prev => {
      const exists = prev.find(a => a.uuid === article.uuid);
      if (exists) {
        return prev.filter(a => a.uuid !== article.uuid);
      }
      return [...prev, article];
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchQuery(searchInput);
      setIsFavoritesView(false);
      setMobileMenuOpen(false);
    }
  };

  const handleCategoryClick = (cat: string) => {
    setCategory(cat);
    setSearchQuery('');
    setSearchInput('');
    setIsFavoritesView(false);
    setMobileMenuOpen(false);
  };

  const categories = ['tech', 'science', 'business', 'entertainment', 'health'];

  return (
    <div className="app-container">
      {/* Mobile Header */}
      <div className="mobile-header" style={{ display: 'none' /* Handled by CSS media query mostly, but logic here */ }}>
         <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}><Menu /></button>
      </div>

      <aside className={`sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <h1>NEWS FRAME</h1>
        
        <div className="filter-section">
          <h3>Search</h3>
          <form onSubmit={handleSearchSubmit}>
            <input 
              className="search-input"
              type="text" 
              placeholder="Search news..." 
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </form>
        </div>

        <div className="filter-section">
          <h3>Categories</h3>
          <ul className="category-list">
             {categories.map(cat => (
               <li 
                 key={cat} 
                 className={!isFavoritesView && !searchQuery && category === cat ? 'active' : ''}
                 onClick={() => handleCategoryClick(cat)}
               >
                 # {cat}
               </li>
             ))}
          </ul>
        </div>

        <div className="filter-section">
          <h3>Library</h3>
          <ul className="category-list">
            <li 
              className={isFavoritesView ? 'active' : ''}
              onClick={() => { setIsFavoritesView(true); setMobileMenuOpen(false); }}
            >
              ♥ Favorites ({favorites.length})
            </li>
          </ul>
        </div>
      </aside>

      <main className="main-content">
        <HeadlinesList 
          category={category}
          searchQuery={searchQuery}
          isFavoritesView={isFavoritesView}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
        />
      </main>
    </div>
  )
}

export default App
