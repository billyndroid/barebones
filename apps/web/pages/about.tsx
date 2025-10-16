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
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7V10H4V20H20V10H22V7L12 2Z" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <path d="M6 10V16H8V10H6Z" fill="currentColor"/>
                  <path d="M10 10V16H12V10H10Z" fill="currentColor"/>
                  <path d="M14 10V16H16V10H14Z" fill="currentColor"/>
                  <path d="M18 10V16H20V10H18Z" fill="currentColor"/>
                </svg>
                <p>Our headquarters</p>
              </div>
            </div>
          </div>
        </section>

        <section className="values-section">
          <h2>Our Values</h2>
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 8L12 22L22 8L12 2Z" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <path d="M2 8L12 14L22 8" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 14V22" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <h3>Quality First</h3>
              <p>We carefully curate every product to ensure it meets our high standards.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 12L16 7L13 10L11 8L8 11L3 6" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <path d="M16 7H21V12" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" fill="none"/>
                </svg>
              </div>
              <h3>Customer Focus</h3>
              <p>Your satisfaction is our priority. We're here to help every step of the way.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C12 18 16 14 20 10C16 14 12 18 12 22Z" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <path d="M12 22C12 18 8 14 4 10C8 14 12 18 12 22Z" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <path d="M12 22V2" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <h3>Sustainability</h3>
              <p>We're committed to responsible business practices and environmental stewardship.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" strokeWidth="2" fill="currentColor"/>
                </svg>
              </div>
              <h3>Innovation</h3>
              <p>We continuously improve our platform to provide the best shopping experience.</p>
            </div>
          </div>
        </section>

        <section className="team-section">
          <h2>Meet Our Team</h2>
          <div className="team-grid">
            <div className="team-member">
              <div className="member-avatar">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <path d="M20 20C20 16 16 14 12 14S4 16 4 20" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <rect x="8" y="6" width="8" height="2" fill="currentColor"/>
                </svg>
              </div>
              <h3>John Smith</h3>
              <p>CEO & Founder</p>
              <p>Passionate about creating exceptional customer experiences.</p>
            </div>
            <div className="team-member">
              <div className="member-avatar">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <path d="M20 20C20 16 16 14 12 14S4 16 4 20" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <rect x="6" y="5" width="12" height="6" rx="6" fill="none" stroke="currentColor" strokeWidth="1"/>
                </svg>
              </div>
              <h3>Sarah Johnson</h3>
              <p>CTO</p>
              <p>Leading our technology initiatives and platform development.</p>
            </div>
            <div className="team-member">
              <div className="member-avatar">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <path d="M20 20C20 16 16 14 12 14S4 16 4 20" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <circle cx="10" cy="7" r="1" fill="currentColor"/>
                  <circle cx="14" cy="7" r="1" fill="currentColor"/>
                </svg>
              </div>
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
          background: linear-gradient(135deg, #F0386B 0%, #FE654F 100%);
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
          color: #3F334D;
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
          color: #3F334D;
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
          color: #3F334D;
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
          color: #3F334D;
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
          color: #3F334D;
          margin-bottom: 0.5rem;
        }

        .team-member > p:first-of-type {
          color: #F0386B;
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
          color: #3F334D;
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