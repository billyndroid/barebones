import { useState } from 'react';

interface SearchAndFilterProps {
  onSearch: (term: string) => void;
  onSort: (sortBy: 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc') => void;
  searchTerm?: string;
  sortBy?: string;
  resultsCount?: number;
}

export function SearchAndFilter({ 
  onSearch, 
  onSort, 
  searchTerm = '', 
  sortBy = 'name-asc',
  resultsCount = 0
}: SearchAndFilterProps) {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(localSearchTerm);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearchTerm(value);
    
    // Debounced search - search as user types after a short delay
    if (value.length === 0 || value.length >= 2) {
      setTimeout(() => {
        if (e.target.value === value) { // Only search if value hasn't changed
          onSearch(value);
        }
      }, 300);
    }
  };

  const clearSearch = () => {
    setLocalSearchTerm('');
    onSearch('');
  };

  return (
    <div className="search-filter-container">
      <div className="search-section">
        <form onSubmit={handleSearchSubmit} className="search-form">
          <div className="search-input-container">
            <input
              type="text"
              placeholder="Search products..."
              value={localSearchTerm}
              onChange={handleSearchChange}
              className="search-input"
            />
            {localSearchTerm && (
              <button 
                type="button" 
                onClick={clearSearch}
                className="clear-search-btn"
                aria-label="Clear search"
              >
                ×
              </button>
            )}
            <button type="submit" className="search-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="21 21l-4.35-4.35"></path>
              </svg>
            </button>
          </div>
        </form>
      </div>

      <div className="filter-section">
        <div className="sort-container">
          <label htmlFor="sort-select" className="sort-label">
            Sort by:
          </label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => onSort(e.target.value as any)}
            className="sort-select"
          >
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="price-asc">Price (Low to High)</option>
            <option value="price-desc">Price (High to Low)</option>
          </select>
        </div>
      </div>

      <style jsx>{`
        .search-filter-container {
          background: white;
          padding: 1.5rem;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          margin-bottom: 2rem;
          display: flex;
          gap: 2rem;
          align-items: center;
          flex-wrap: wrap;
        }

        .search-section {
          flex: 1;
          min-width: 300px;
        }

        .search-form {
          width: 100%;
        }

        .search-input-container {
          position: relative;
          display: flex;
          align-items: center;
        }

        .search-input {
          width: 100%;
          padding: 0.75rem 3rem 0.75rem 1rem;
          border: 2px solid #e1e8ed;
          border-radius: 25px;
          font-size: 0.95rem;
          outline: none;
          transition: all 0.2s ease;
        }

        .search-input:focus {
          border-color: #3498db;
          box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
        }

        .clear-search-btn {
          position: absolute;
          right: 3rem;
          background: none;
          border: none;
          font-size: 1.5rem;
          color: #95a5a6;
          cursor: pointer;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.2s ease;
        }

        .clear-search-btn:hover {
          color: #e74c3c;
        }

        .search-btn {
          position: absolute;
          right: 0.5rem;
          background: #3498db;
          color: white;
          border: none;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .search-btn:hover {
          background: #2980b9;
          transform: scale(1.05);
        }

        .filter-section {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .sort-container {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .sort-label {
          font-size: 0.9rem;
          color: #2c3e50;
          font-weight: 500;
          white-space: nowrap;
        }

        .sort-select {
          padding: 0.5rem 1rem;
          border: 2px solid #e1e8ed;
          border-radius: 6px;
          font-size: 0.9rem;
          background: white;
          cursor: pointer;
          outline: none;
          transition: border-color 0.2s ease;
          min-width: 140px;
        }

        .sort-select:focus {
          border-color: #3498db;
        }

        @media (max-width: 768px) {
          .search-filter-container {
            flex-direction: column;
            gap: 1rem;
            align-items: stretch;
          }

          .search-section {
            min-width: auto;
          }

          .filter-section {
            justify-content: space-between;
          }

          .sort-container {
            flex: 1;
            justify-content: space-between;
          }

          .sort-select {
            min-width: 120px;
          }
        }

        @media (max-width: 480px) {
          .search-filter-container {
            padding: 1rem;
          }

          .search-input {
            padding: 0.65rem 3rem 0.65rem 0.75rem;
            font-size: 0.9rem;
          }

          .search-btn {
            width: 32px;
            height: 32px;
          }

          .clear-search-btn {
            right: 2.5rem;
          }
        }
      `}</style>
    </div>
  );
}