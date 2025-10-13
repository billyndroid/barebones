import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Header } from '../components/Header';
import { ProductGrid } from '../components/ProductGrid';
import { Button } from '../components/UIComponents';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl?: string;
}

interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  productCount: number;
}

// Mock categories for now - in a real app these would come from the API
const mockCategories: Category[] = [
  {
    id: 'electronics',
    name: 'Electronics',
    description: 'Tech gadgets and electronic devices',
    icon: '📱',
    productCount: 8
  },
  {
    id: 'accessories',
    name: 'Accessories',
    description: 'Complementary items and add-ons',
    icon: '🎒',
    productCount: 5
  },
  {
    id: 'home-office',
    name: 'Home & Office',
    description: 'Furniture and office essentials',
    icon: '🏠',
    productCount: 7
  },
  {
    id: 'health-fitness',
    name: 'Health & Fitness',
    description: 'Wellness and fitness products',
    icon: '💪',
    productCount: 3
  }
];

export default function Categories() {
  const router = useRouter();
  const { category } = router.query;
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  useEffect(() => {
    if (category) {
      const cat = mockCategories.find(c => c.id === category);
      setSelectedCategory(cat || null);
      fetchCategoryProducts(category as string);
    } else {
      setSelectedCategory(null);
      fetchAllProducts();
    }
  }, [category]);

  const fetchAllProducts = async () => {
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

  const fetchCategoryProducts = async (categoryId: string) => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const response = await fetch(`${API_URL}/api/products`);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const allProducts = await response.json();
      
      // Mock category filtering based on product titles/descriptions
      let filteredProducts = allProducts;
      
      switch (categoryId) {
        case 'electronics':
          filteredProducts = allProducts.filter((p: Product) => 
            p.title.toLowerCase().includes('headphones') ||
            p.title.toLowerCase().includes('smartphone') ||
            p.title.toLowerCase().includes('power bank') ||
            p.title.toLowerCase().includes('keyboard') ||
            p.title.toLowerCase().includes('mouse') ||
            p.title.toLowerCase().includes('webcam') ||
            p.title.toLowerCase().includes('speaker') ||
            p.title.toLowerCase().includes('smart watch')
          );
          break;
        case 'accessories':
          filteredProducts = allProducts.filter((p: Product) => 
            p.title.toLowerCase().includes('stand') ||
            p.title.toLowerCase().includes('hub') ||
            p.title.toLowerCase().includes('sleeve') ||
            p.title.toLowerCase().includes('case') ||
            p.title.toLowerCase().includes('warmer')
          );
          break;
        case 'home-office':
          filteredProducts = allProducts.filter((p: Product) => 
            p.title.toLowerCase().includes('chair') ||
            p.title.toLowerCase().includes('desk') ||
            p.title.toLowerCase().includes('lamp') ||
            p.title.toLowerCase().includes('monitor')
          );
          break;
        case 'health-fitness':
          filteredProducts = allProducts.filter((p: Product) => 
            p.title.toLowerCase().includes('fitness') ||
            p.title.toLowerCase().includes('health') ||
            p.title.toLowerCase().includes('watch')
          );
          break;
        default:
          filteredProducts = allProducts;
      }
      
      setProducts(filteredProducts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (categoryId: string) => {
    router.push(`/categories?category=${categoryId}`);
  };

  return (
    <>
      <Header />
      <div className="container">
        {!selectedCategory ? (
          <>
            <div className="page-header">
              <h1>Shop by Category</h1>
              <p>Discover products organized by category to find exactly what you need</p>
            </div>

            <div className="categories-grid">
              {mockCategories.map((category) => (
                <div 
                  key={category.id} 
                  className="category-card"
                  onClick={() => handleCategoryClick(category.id)}
                >
                  <div className="category-icon">{category.icon}</div>
                  <h3>{category.name}</h3>
                  <p>{category.description}</p>
                  <div className="product-count">
                    {category.productCount} product{category.productCount !== 1 ? 's' : ''}
                  </div>
                  <div className="category-overlay">
                    <Button variant="primary">Shop Now</Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="featured-section">
              <h2>All Products</h2>
              <p>Browse our complete collection</p>
              <ProductGrid
                products={products.slice(0, 8)}
                loading={loading}
                error={error}
              />
              {products.length > 8 && (
                <div className="view-all-section">
                  <Button 
                    variant="outline"
                    onClick={() => router.push('/products')}
                  >
                    View All Products
                  </Button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="category-header">
              <nav className="breadcrumb">
                <span onClick={() => router.push('/')}>Home</span>
                <span> / </span>
                <span onClick={() => router.push('/categories')}>Categories</span>
                <span> / </span>
                <span>{selectedCategory.name}</span>
              </nav>
              
              <div className="category-info">
                <div className="category-icon-large">{selectedCategory.icon}</div>
                <div>
                  <h1>{selectedCategory.name}</h1>
                  <p>{selectedCategory.description}</p>
                  <div className="category-stats">
                    {products.length} product{products.length !== 1 ? 's' : ''} available
                  </div>
                </div>
              </div>
            </div>

            <div className="category-filters">
              <div className="filter-options">
                <Button 
                  variant="outline" 
                  size="small"
                  onClick={() => router.push('/categories')}
                >
                  ← All Categories
                </Button>
              </div>
            </div>

            <ProductGrid
              products={products}
              loading={loading}
              error={error}
            />

            {products.length === 0 && !loading && !error && (
              <div className="empty-category">
                <div className="empty-icon">{selectedCategory.icon}</div>
                <h3>No products found in {selectedCategory.name}</h3>
                <p>Check back soon for new additions to this category</p>
                <Button 
                  variant="primary"
                  onClick={() => router.push('/categories')}
                >
                  Browse Other Categories
                </Button>
              </div>
            )}
          </>
        )}
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
          font-size: 3rem;
          color: #2c3e50;
          margin-bottom: 0.5rem;
        }

        .page-header p {
          font-size: 1.1rem;
          color: #7f8c8d;
        }

        .categories-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
          margin-bottom: 4rem;
        }

        .category-card {
          background: white;
          padding: 2.5rem 2rem;
          border-radius: 16px;
          text-align: center;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          border: 1px solid #e9ecef;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .category-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
        }

        .category-card:hover .category-overlay {
          opacity: 1;
          visibility: visible;
        }

        .category-icon {
          font-size: 4rem;
          margin-bottom: 1.5rem;
          transition: transform 0.3s ease;
        }

        .category-card:hover .category-icon {
          transform: scale(1.1);
        }

        .category-card h3 {
          color: #2c3e50;
          margin-bottom: 1rem;
          font-size: 1.5rem;
        }

        .category-card p {
          color: #7f8c8d;
          line-height: 1.6;
          margin-bottom: 1rem;
        }

        .product-count {
          background: #667eea;
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.9rem;
          font-weight: 600;
          display: inline-block;
        }

        .category-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(102, 126, 234, 0.95);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
        }

        .category-header {
          margin-bottom: 2rem;
        }

        .breadcrumb {
          margin-bottom: 2rem;
          font-size: 0.9rem;
          color: #7f8c8d;
        }

        .breadcrumb span {
          cursor: pointer;
        }

        .breadcrumb span:hover:not(:last-child) {
          color: #2c3e50;
          text-decoration: underline;
        }

        .breadcrumb span:last-child {
          color: #2c3e50;
          font-weight: 600;
        }

        .category-info {
          display: flex;
          align-items: center;
          gap: 2rem;
          padding: 2rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 16px;
          color: white;
        }

        .category-icon-large {
          font-size: 5rem;
          opacity: 0.9;
        }

        .category-info h1 {
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
        }

        .category-info p {
          opacity: 0.9;
          margin-bottom: 1rem;
          font-size: 1.1rem;
        }

        .category-stats {
          background: rgba(255, 255, 255, 0.2);
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.9rem;
          display: inline-block;
        }

        .category-filters {
          margin: 2rem 0;
          padding: 1rem 0;
          border-bottom: 1px solid #e9ecef;
        }

        .filter-options {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .featured-section {
          margin-top: 3rem;
        }

        .featured-section h2 {
          font-size: 2.5rem;
          color: #2c3e50;
          text-align: center;
          margin-bottom: 0.5rem;
        }

        .featured-section > p {
          text-align: center;
          color: #7f8c8d;
          margin-bottom: 3rem;
          font-size: 1.1rem;
        }

        .view-all-section {
          text-align: center;
          margin-top: 3rem;
        }

        .empty-category {
          text-align: center;
          padding: 4rem 2rem;
        }

        .empty-icon {
          font-size: 4rem;
          margin-bottom: 2rem;
          opacity: 0.5;
        }

        .empty-category h3 {
          color: #2c3e50;
          margin-bottom: 1rem;
          font-size: 1.5rem;
        }

        .empty-category p {
          color: #7f8c8d;
          margin-bottom: 2rem;
          font-size: 1.1rem;
        }

        @media (max-width: 768px) {
          .container {
            padding: 1rem;
          }

          .page-header h1 {
            font-size: 2.5rem;
          }

          .categories-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .category-info {
            flex-direction: column;
            text-align: center;
            gap: 1rem;
          }

          .category-info h1 {
            font-size: 2rem;
          }

          .category-icon-large {
            font-size: 4rem;
          }

          .featured-section h2 {
            font-size: 2rem;
          }
        }
      `}</style>
    </>
  );
}