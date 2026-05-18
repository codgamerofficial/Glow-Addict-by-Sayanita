'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mic, Search, TrendingUp, X } from 'lucide-react';
import type { Product } from '@/types/product';

declare global {
  interface Window {
    webkitSpeechRecognition?: new () => {
      lang: string;
      continuous: boolean;
      interimResults: boolean;
      onresult: (event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void;
      onerror: () => void;
      onend: () => void;
      start: () => void;
    };
    SpeechRecognition?: new () => {
      lang: string;
      continuous: boolean;
      interimResults: boolean;
      onresult: (event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void;
      onerror: () => void;
      onend: () => void;
      start: () => void;
    };
  }
}

export function SearchBar({ onClose }: { onClose?: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [trending, setTrending] = useState<string[]>([]);
  const [recent, setRecent] = useState<string[]>([]);
  const [didYouMean, setDidYouMean] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('ga-recent-searches');
      if (!raw) return;
      const parsed = JSON.parse(raw) as string[];
      if (Array.isArray(parsed)) {
        setRecent(parsed.slice(0, 6));
      }
    } catch {
      // noop
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        const mode = query.trim() ? 'suggest' : 'trending';
        const response = await fetch(`/api/search?mode=${mode}&q=${encodeURIComponent(query.trim())}&limit=8`, {
          signal: controller.signal,
        });
        if (!response.ok) return;
        const data = await response.json();
        setResults(Array.isArray(data.products) ? data.products : []);
        setSuggestions(Array.isArray(data.suggestions) ? data.suggestions.slice(0, 6) : []);
        setTrending(Array.isArray(data.trending) ? data.trending.slice(0, 8) : []);
        setDidYouMean(typeof data.didYouMean === 'string' ? data.didYouMean : null);
      } catch {
        // ignore aborted/temporary failures
      } finally {
        setLoading(false);
      }
    }, 220);

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [query]);

  const saveRecent = (value: string) => {
    const normalized = value.trim();
    if (!normalized) return;
    const next = [normalized, ...recent.filter((item) => item.toLowerCase() !== normalized.toLowerCase())].slice(0, 6);
    setRecent(next);
    try {
      localStorage.setItem('ga-recent-searches', JSON.stringify(next));
    } catch {
      // noop
    }
  };

  const openSearchResults = (value: string) => {
    const normalized = value.trim();
    if (!normalized) return;
    saveRecent(normalized);
    router.push(`/products?q=${encodeURIComponent(normalized)}`);
    onClose?.();
  };

  const startVoiceSearch = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript || '';
      if (transcript) {
        setQuery(transcript);
        openSearchResults(transcript);
      }
    };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);

    setListening(true);
    recognition.start();
  };

  const quickPills = useMemo(() => {
    if (query.trim()) {
      return suggestions.length > 0 ? suggestions : [query.trim()];
    }
    return [...recent, ...trending].filter((value, index, arr) => arr.indexOf(value) === index).slice(0, 8);
  }, [query, suggestions, recent, trending]);

  return (
    <div className="search-shell">
      <div className="search-input-wrap">
        <Search size={18} />
        <input
          type="text"
          aria-label="Search products"
          placeholder="Search products, brands, concerns..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              openSearchResults(query);
            }
          }}
          autoFocus
          className="input-glass"
        />
        <button type="button" aria-label="Voice search" onClick={startVoiceSearch} style={{ right: onClose ? 48 : 10 }}>
          <Mic size={18} color={listening ? 'var(--primary)' : 'currentColor'} />
        </button>
        {onClose && (
          <button type="button" aria-label="Close search" onClick={onClose}>
            <X size={18} />
          </button>
        )}
      </div>

      {(query.trim() || quickPills.length > 0) && (
        <div className="search-results">
          {loading ? (
            <div style={{ padding: '16px', fontSize: '13px', color: 'var(--text-muted)' }}>Searching...</div>
          ) : results.length > 0 ? (
            <div className="search-result-list">
              {results.map((product) => (
                <Link key={product.id} href={`/products/${product.slug}`} onClick={() => saveRecent(product.name)} className="search-result">
                  <div className="search-thumb">
                    <Image src={product.images[0]} alt={product.name} fill sizes="44px" />
                  </div>
                  <div>
                    <strong>{product.name}</strong>
                    <span>{product.brandName}</span>
                  </div>
                  <em>&#8377;{(product.salePrice || product.price).toLocaleString()}</em>
                </Link>
              ))}
              <button type="button" className="search-view-all" onClick={() => openSearchResults(query)}>
                View all results for "{query.trim()}"
              </button>
            </div>
          ) : (
            <div className="search-trending">
              <div>
                <TrendingUp size={14} /> {query.trim() ? 'Suggestions' : 'Trending searches'}
              </div>
              {didYouMean && query.trim() && didYouMean !== query.trim().toLowerCase() && (
                <button type="button" className="search-did-you-mean" onClick={() => setQuery(didYouMean)}>
                  Did you mean: {didYouMean}
                </button>
              )}
              <div>
                {quickPills.map((item) => (
                  <button key={item} type="button" onClick={() => (query.trim() ? setQuery(item) : openSearchResults(item))}>
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <style jsx global>{`
        .search-shell {
          position: relative;
          max-width: 720px;
          margin: 0 auto;
          padding: 8px 0;
        }

        .search-input-wrap {
          position: relative;
        }

        .search-input-wrap > svg {
          position: absolute;
          top: 50%;
          left: 16px;
          z-index: 1;
          color: var(--text-muted);
          transform: translateY(-50%);
        }

        .search-input-wrap input {
          padding-left: 46px;
          padding-right: 84px;
          font-size: 15px;
        }

        .search-input-wrap button {
          position: absolute;
          top: 50%;
          right: 10px;
          display: grid;
          place-items: center;
          width: 34px;
          height: 34px;
          border: 0;
          border-radius: 999px;
          color: var(--text-muted);
          background: transparent;
          cursor: pointer;
          transform: translateY(-50%);
        }

        .search-input-wrap button:hover {
          color: var(--primary);
          background: var(--bg-surface-hover);
        }

        .search-results {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          z-index: 50;
          overflow: hidden;
          margin-top: 10px;
          border: 1px solid var(--line);
          border-radius: 22px;
          background: var(--bg-surface);
          box-shadow: var(--shadow-soft);
        }

        .search-result-list {
          padding: 8px;
        }

        .search-result {
          display: grid;
          grid-template-columns: 44px minmax(0, 1fr) auto;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          border-radius: 15px;
          color: var(--text-primary);
          text-decoration: none;
          transition: background 0.2s var(--spring);
        }

        .search-result:hover {
          background: var(--bg-surface-hover);
        }

        .search-thumb {
          position: relative;
          width: 44px;
          height: 44px;
          overflow: hidden;
          border-radius: 12px;
          background: var(--bg-surface-hover);
        }

        .search-thumb img {
          object-fit: cover;
        }

        .search-result strong,
        .search-result span {
          display: block;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .search-result strong {
          font-size: 14px;
          font-weight: 800;
        }

        .search-result span {
          margin-top: 2px;
          color: var(--text-muted);
          font-size: 12px;
          font-weight: 700;
        }

        .search-result em {
          color: var(--primary);
          font-style: normal;
          font-weight: 900;
        }

        .search-trending {
          padding: 16px;
        }

        .search-trending > div:first-child {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 12px;
          color: var(--text-muted);
          font-size: 12px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .search-trending > div:last-child {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .search-did-you-mean {
          margin-bottom: 10px;
          border: none;
          background: transparent;
          color: var(--primary);
          font-size: 12px;
          font-weight: 800;
          cursor: pointer;
        }

        .search-view-all {
          width: 100%;
          margin-top: 6px;
          border: 0;
          border-top: 1px solid var(--line);
          background: transparent;
          color: var(--primary);
          padding: 12px;
          font-size: 13px;
          font-weight: 800;
          cursor: pointer;
          text-align: center;
        }

        .search-trending button {
          min-height: 34px;
          padding: 7px 13px;
          border: 1px solid var(--line);
          border-radius: 999px;
          color: var(--text-secondary);
          background: var(--bg-surface-hover);
          font-size: 13px;
          font-weight: 800;
          cursor: pointer;
        }

        .search-trending button:hover {
          color: var(--primary);
          border-color: rgba(245, 31, 123, 0.26);
        }
      `}</style>
    </div>
  );
}
