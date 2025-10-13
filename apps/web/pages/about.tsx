import { Header } from '../components/Header';
import { Button } from '../components/UIComponents';

export default function About() {
  return (
    <>
      <Header />
      <div className="container">
        <div className="hero-section">
          <h1>About Barebones Store</h1>
          <p>Your trusted partner in quality products and exceptional service</p>
        </div>

        <section className="story-section">
          <div className="story-content">
            <div className="story-text">
              <h2>Our Story</h2>
              <p>
                Founded with a simple mission: to provide high-quality products at fair prices 
                with exceptional customer service. We believe that shopping should be easy, 
                enjoyable, and worry-free.
              </p>
              <p>
                What started as a small team with big dreams has grown into a trusted 
                e-commerce platform serving customers worldwide. We're committed to 
                continuous improvement and innovation in everything we do.
              </p>
            </div>
            <div className="story-image">
              <div className="placeholder-image">
                <span>🏢</span>
                <p>Our headquarters</p>
              </div>
            </div>
          </div>
        </section>

        <section className="values-section">
          <h2>Our Values</h2>
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">💎</div>
              <h3>Quality First</h3>
              <p>We carefully curate every product to ensure it meets our high standards.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">🤝</div>
              <h3>Customer Focus</h3>
              <p>Your satisfaction is our priority. We're here to help every step of the way.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">🌱</div>
              <h3>Sustainability</h3>
              <p>We're committed to responsible business practices and environmental stewardship.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">⚡</div>
              <h3>Innovation</h3>
              <p>We continuously improve our platform to provide the best shopping experience.</p>
            </div>
          </div>
        </section>

        <section className="team-section">
          <h2>Meet Our Team</h2>
          <div className="team-grid">
            <div className="team-member">
              <div className="member-avatar">👨‍💼</div>
              <h3>John Smith</h3>
              <p>CEO & Founder</p>
              <p>Passionate about creating exceptional customer experiences.</p>
            </div>
            <div className="team-member">
              <div className="member-avatar">👩‍💻</div>
              <h3>Sarah Johnson</h3>
              <p>CTO</p>
              <p>Leading our technology initiatives and platform development.</p>
            </div>
            <div className="team-member">
              <div className="member-avatar">👨‍🎨</div>
              <h3>Mike Chen</h3>
              <p>Head of Design</p>
              <p>Crafting beautiful and intuitive user experiences.</p>
            </div>
          </div>
        </section>

        <section className="cta-section">
          <h2>Ready to Get Started?</h2>
          <p>Join thousands of satisfied customers who trust Barebones Store</p>
          <div className="cta-buttons">
            <Button 
              variant="primary" 
              size="large"
              onClick={() => window.location.href = '/products'}
            >
              Shop Now
            </Button>
            <Button 
              variant="outline" 
              size="large"
              onClick={() => window.location.href = '/contact'}
            >
              Contact Us
            </Button>
          </div>
        </section>
      </div>

      <style jsx>{`
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .hero-section {
          text-align: center;
          padding: 4rem 2rem;
          background: linear-gradient(135deg, #2c3e50 0%, #4a6741 100%);
          border-radius: 16px;
          color: white;
          margin-bottom: 4rem;
        }

        .hero-section h1 {
          font-size: 3rem;
          margin-bottom: 1rem;
          font-weight: 700;
        }

        .hero-section p {
          font-size: 1.25rem;
          opacity: 0.9;
        }

        .story-section {
          margin-bottom: 4rem;
        }

        .story-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
        }

        .story-text h2 {
          font-size: 2.5rem;
          color: #2c3e50;
          margin-bottom: 2rem;
        }

        .story-text p {
          font-size: 1.1rem;
          line-height: 1.8;
          color: #5a6c7d;
          margin-bottom: 1.5rem;
        }

        .placeholder-image {
          background: #f8f9fa;
          border-radius: 12px;
          padding: 4rem 2rem;
          text-align: center;
          border: 2px dashed #dee2e6;
        }

        .placeholder-image span {
          font-size: 4rem;
          display: block;
          margin-bottom: 1rem;
        }

        .placeholder-image p {
          color: #6c757d;
          font-style: italic;
        }

        .values-section {
          margin-bottom: 4rem;
        }

        .values-section h2 {
          text-align: center;
          font-size: 2.5rem;
          color: #2c3e50;
          margin-bottom: 3rem;
        }

        .values-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
        }

        .value-card {
          background: white;
          padding: 2.5rem 2rem;
          border-radius: 12px;
          text-align: center;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          border: 1px solid #e9ecef;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .value-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }

        .value-icon {
          font-size: 3rem;
          margin-bottom: 1.5rem;
        }

        .value-card h3 {
          color: #2c3e50;
          margin-bottom: 1rem;
          font-size: 1.25rem;
        }

        .value-card p {
          color: #7f8c8d;
          line-height: 1.6;
        }

        .team-section {
          margin-bottom: 4rem;
        }

        .team-section h2 {
          text-align: center;
          font-size: 2.5rem;
          color: #2c3e50;
          margin-bottom: 3rem;
        }

        .team-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
        }

        .team-member {
          background: white;
          padding: 2.5rem 2rem;
          border-radius: 12px;
          text-align: center;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          border: 1px solid #e9ecef;
        }

        .member-avatar {
          font-size: 4rem;
          margin-bottom: 1.5rem;
        }

        .team-member h3 {
          color: #2c3e50;
          margin-bottom: 0.5rem;
        }

        .team-member > p:first-of-type {
          color: #667eea;
          font-weight: 600;
          margin-bottom: 1rem;
        }

        .team-member > p:last-of-type {
          color: #7f8c8d;
          line-height: 1.6;
        }

        .cta-section {
          text-align: center;
          background: #f8f9fa;
          padding: 4rem 2rem;
          border-radius: 16px;
        }

        .cta-section h2 {
          font-size: 2.5rem;
          color: #2c3e50;
          margin-bottom: 1rem;
        }

        .cta-section > p {
          font-size: 1.1rem;
          color: #7f8c8d;
          margin-bottom: 2rem;
        }

        .cta-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        @media (max-width: 768px) {
          .container {
            padding: 1rem;
          }

          .hero-section {
            padding: 3rem 1rem;
          }

          .hero-section h1 {
            font-size: 2.5rem;
          }

          .story-content {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .values-grid,
          .team-grid {
            grid-template-columns: 1fr;
          }

          .cta-buttons {
            flex-direction: column;
            align-items: center;
          }
        }
      `}</style>
    </>
  );
}