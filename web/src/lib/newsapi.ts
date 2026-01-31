// filepath: /Users/michaelrobards/Documents/Projects/ztm/vibe-coding/news-reader/web/src/lib/newsapi.ts
export interface Article {
  uuid: string;
  title: string;
  description: string;
  keywords: string;
  snippet: string;
  url: string;
  image_url: string;
  language: string;
  published_at: string;
  source: string;
  categories: string[];
}

export interface NewsResponse {
  meta: {
    found: number;
    returned: number;
    limit: number;
    page: number;
  };
  data: Article[];
}

export async function fetchNews(params: {
  search?: string;
  categories?: string;
  page?: number;
}): Promise<NewsResponse> {
  const query = new URLSearchParams();
  if (params.search) query.append('search', params.search);
  if (params.categories) query.append('categories', params.categories);
  if (params.page) query.append('page', params.page.toString());

  const response = await fetch(`/api/news?${query.toString()}`);
  
  if (!response.ok) {
    // Handle specific error codes if needed, or throw generic
    if (response.status === 429) {
      throw new Error('Rate limit reached (429)');
    }
    if (response.status === 401 || response.status === 403) {
      throw new Error('Authentication failed (401/403)');
    }
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
}
