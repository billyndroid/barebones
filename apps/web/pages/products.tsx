import { useState, useEffect } from 'react';
import { ProductGrid } from '../components/ProductGrid';
import { SearchAndFilter } from '../components/SearchAndFilter';
import { Header } from '../components/Header';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl?: string;
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'name-asc' | 'name-desc'>('name-asc');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const response = await fetch(`${API_URL}/api/products`);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleSort = (newSortBy: 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc') => {
    setSortBy(newSortBy);
  };

  return (
    <>
      <Header />
      <div className="container">
        <div className="page-header">
          <h1>All Products</h1>
          <p>Discover our amazing collection of products</p>
        </div>

        <SearchAndFilter
          onSearch={handleSearch}
          onSort={handleSort}
          searchTerm={searchTerm}
          sortBy={sortBy}
        />

        <ProductGrid
          products={products}
          loading={loading}
          error={error}
          searchTerm={searchTerm}
          sortBy={sortBy}
        />
      </div>

      <style jsx>{`
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .page-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .page-header h1 {
          font-size: 2.5rem;
          color: #2c3e50;
          margin-bottom: 0.5rem;
        }

        .page-header p {
          font-size: 1.1rem;
          color: #7f8c8d;
        }

        @media (max-width: 768px) {
          .container {
            padding: 1rem;
          }
          
          .page-header h1 {
            font-size: 2rem;
          }
        }
      `}</style>
    </>
  );
}