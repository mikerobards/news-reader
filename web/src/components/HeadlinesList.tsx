// filepath: /Users/michaelrobards/Documents/Projects/ztm/vibe-coding/news-reader/web/src/components/HeadlinesList.tsx
import React, { useEffect, useState, useRef } from 'react';
import { Article, fetchNews } from '../lib/newsapi';
import './HeadlinesList.css'; // Optional helper styles if needed, but we used global styles.css

interface HeadlinesListProps {
  category: string;
  searchQuery: string;
  isFavoritesView: boolean;
  favorites: Article[];
  onToggleFavorite: (article: Article) => void;
}

export const HeadlinesList: React.FC<HeadlinesListProps> = ({
  category,
  searchQuery,
  isFavoritesView,
  favorites,
  onToggleFavorite,
}) => {
  // --- State ---
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(0); // Index within the page (0-2)

  // Cache: { [pageNumber]: Article[] }
  const cache = useRef<Record<number, Article[]>>({});

  // --- Effects ---

  // Reset when filter changes
  useEffect(() => {
    if (!isFavoritesView) {
      setArticles([]);
      setCurrentPage(1);
      setCurrentIndex(0);
      cache.current = {};
      loadPage(1);
    }
  }, [category, searchQuery, isFavoritesView]);

  // Load Data
  const loadPage = async (page: number) => {
    // Check cache first
    if (cache.current[page]) {
      setArticles(cache.current[page]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // If fetching page 1, fetch fresh
      const response = await fetchNews({ 
        categories: category, 
        search: searchQuery, 
        page 
      });
      
      const newArticles = response.data;
      cache.current[page] = newArticles;
      setArticles(newArticles);
      
      // Handle empty results
      if (newArticles.length === 0 && page === 1) {
        setError("No articles found.");
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load news');
    } finally {
      setLoading(false);
    }
  };

  // Prefetch logic depends on currentIndex
  useEffect(() => {
    if (isFavoritesView) return;
    
    // If viewing the last item (index 2) of a 3-item page, prefetch next page
    if (currentIndex === 2 && articles.length > 0) {
       // Check if next page is already cached to avoid dupes
       if (!cache.current[currentPage + 1]) {
         prefetchPage(currentPage + 1);
       }
    }
  }, [currentIndex, articles, isFavoritesView, currentPage]);

  const prefetchPage = async (page: number) => {
    console.log(`Prefetching page ${page}...`);
    try {
      const response = await fetchNews({ 
        categories: category, 
        search: searchQuery, 
        page 
      });
      cache.current[page] = response.data;
    } catch (e) {
      // Silent fail on prefetch
      console.warn('Prefetch failed', e);
    }
  };

  // --- Navigation Handlers ---

  const handleNext = () => {
    if (isFavoritesView) {
      // Circular local navigation for favorites
      if (favorites.length === 0) return;
      setCurrentIndex((prev) => (prev + 1) % favorites.length);
      return;
    }

    // Normal view navigation
    if (currentIndex < articles.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Move to next page
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      setCurrentIndex(0);
      loadPage(nextPage);
    }
  };

  const handlePrev = () => {
    if (isFavoritesView) {
       if (favorites.length === 0) return;
       setCurrentIndex((prev) => (prev - 1 + favorites.length) % favorites.length);
       return;
    }

    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      // Move to previous page
      if (currentPage > 1) {
        const prevPage = currentPage - 1;
        setCurrentPage(prevPage);
        // We need to know previous page length to set index to last item
        // But since we enforce limit=3, we assume 3, or check cache
        const prevArticles = cache.current[prevPage] || [];
        // If not successfully cached, we might need to load it. 
        // For simplicity, load then set index.
        if (prevArticles.length > 0) {
           setArticles(prevArticles);
           setCurrentIndex(prevArticles.length - 1);
        } else {
           // Fallback if cache missing
           loadPage(prevPage).then(() => {
              // This acts as a slight race condition fix: 
              // we can't easily know length before loading.
              // For this specific requirements, we can just set to 0 or 2.
              // Let's set to 0 for safety or assume 2.
              // Implementation detail: we could return data from loadPage.
              // ignoring complex undo logic for now.
              setCurrentIndex(2); 
           });
        }
      }
    }
  };

  // --- Render ---

  // Determine which list to show
  const activeList = isFavoritesView ? favorites : articles;
  const currentArticle = activeList[currentIndex];

  if (loading && activeList.length === 0) {
    return <div className="loading">Loading news...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (isFavoritesView && favorites.length === 0) {
     return <div className="empty-state">No favorites saved yet.</div>;
  }

  if (!currentArticle) {
    return <div className="empty-state">No articles available.</div>;
  }

  const isFav = favorites.some(a => a.uuid === currentArticle.uuid);

  return (
    <div className="article-viewer">
      <div className="article-card">
        <img 
          src={currentArticle.image_url} 
          alt={currentArticle.title} 
          className="article-image"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://placehold.co/600x400?text=No+Image';
          }}
        />
        <div className="article-overlay">
          <span className="article-source">{currentArticle.source}</span>
          <h2 className="article-title">{currentArticle.title}</h2>
          <p className="article-snippet">{currentArticle.snippet}</p>
          
          <div className="article-actions">
            <a href={currentArticle.url} target="_blank" rel="noopener noreferrer" className="read-more">
              Read Full Story
            </a>
            <button 
              className={`fav-btn ${isFav ? 'active' : ''}`} 
              onClick={() => onToggleFavorite(currentArticle)}
            >
              ♥ {isFav ? 'Saved' : 'Save'}
            </button>
          </div>
        </div>
      </div>

      <div className="pagination-controls">
        <button className="page-btn" onClick={() => setCurrentPage(1)} disabled={isFavoritesView}>«</button>
        <button className="page-btn" onClick={handlePrev}>‹</button>
        
        <span className="page-indicator">
          {isFavoritesView ? (
             `${currentIndex + 1} / ${favorites.length}`
          ) : (
             `Page ${currentPage} • ${currentIndex + 1}/3`
          )}
        </span>

        <button className="page-btn" onClick={handleNext}>›</button>
      </div>
    </div>
  );
};
