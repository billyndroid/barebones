import { useState } from 'react';
import { Header } from '../components/Header';
import { Button, Input } from '../components/UIComponents';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setSubmitMessage('Thank you for your message! We\'ll get back to you soon.');
      setIsSubmitting(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 2000);
  };

  return (
    <>
      <Header />
      <div className="container">
        <div className="hero-section">
          <h1>Contact Us</h1>
          <p>We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
        </div>

        <div className="contact-content">
          <div className="contact-info">
            <h2>Get in Touch</h2>
            <div className="info-cards">
              <div className="info-card">
                <div className="info-icon">📧</div>
                <h3>Email</h3>
                <p>support@barebones.com</p>
                <p>sales@barebones.com</p>
              </div>
              <div className="info-card">
                <div className="info-icon">📞</div>
                <h3>Phone</h3>
                <p>+1 (555) 123-4567</p>
                <p>Mon-Fri: 9AM-6PM EST</p>
              </div>
              <div className="info-card">
                <div className="info-icon">📍</div>
                <h3>Address</h3>
                <p>123 Commerce Street</p>
                <p>Business District, NY 10001</p>
              </div>
              <div className="info-card">
                <div className="info-icon">💬</div>
                <h3>Live Chat</h3>
                <p>Available 24/7</p>
                <p>Click the chat icon</p>
              </div>
            </div>

            <div className="faq-section">
              <h3>Frequently Asked Questions</h3>
              <div className="faq-list">
                <details className="faq-item">
                  <summary>What is your return policy?</summary>
                  <p>We offer a 30-day return policy for all unused items in original packaging. Return shipping is free for defective items.</p>
                </details>
                <details className="faq-item">
                  <summary>How long does shipping take?</summary>
                  <p>Standard shipping takes 3-5 business days. Express shipping (1-2 days) and overnight options are available.</p>
                </details>
                <details className="faq-item">
                  <summary>Do you offer international shipping?</summary>
                  <p>Yes, we ship to most countries worldwide. International shipping times vary by location (7-14 business days).</p>
                </details>
                <details className="faq-item">
                  <summary>How can I track my order?</summary>
                  <p>You'll receive a tracking number via email once your order ships. You can also check your order status in your account.</p>
                </details>
              </div>
            </div>
          </div>

          <div className="contact-form">
            <h2>Send us a Message</h2>
            {submitMessage && (
              <div className="success-message">
                {submitMessage}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                />
              </div>
              <input
                type="text"
                name="subject"
                placeholder="Subject"
                value={formData.subject}
                onChange={handleInputChange}
                required
                className="form-input"
              />
              <textarea
                name="message"
                placeholder="Your Message"
                value={formData.message}
                onChange={handleInputChange}
                required
                rows={6}
              />
              <Button 
                type="submit" 
                variant="primary" 
                size="large"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          </div>
        </div>
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
          background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
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
          max-width: 600px;
          margin: 0 auto;
        }

        .contact-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
        }

        .contact-info h2,
        .contact-form h2 {
          font-size: 2rem;
          color: #2c3e50;
          margin-bottom: 2rem;
        }

        .info-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
          margin-bottom: 3rem;
        }

        .info-card {
          background: white;
          padding: 2rem 1.5rem;
          border-radius: 12px;
          text-align: center;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          border: 1px solid #e9ecef;
        }

        .info-icon {
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }

        .info-card h3 {
          color: #2c3e50;
          margin-bottom: 0.5rem;
          font-size: 1.1rem;
        }

        .info-card p {
          color: #7f8c8d;
          font-size: 0.9rem;
          margin: 0.25rem 0;
        }

        .faq-section h3 {
          color: #2c3e50;
          margin-bottom: 1.5rem;
          font-size: 1.5rem;
        }

        .faq-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .faq-item {
          background: white;
          border: 1px solid #e9ecef;
          border-radius: 8px;
          overflow: hidden;
        }

        .faq-item summary {
          padding: 1.5rem;
          cursor: pointer;
          font-weight: 600;
          color: #2c3e50;
          background: #f8f9fa;
          border-bottom: 1px solid #e9ecef;
        }

        .faq-item summary:hover {
          background: #e9ecef;
        }

        .faq-item p {
          padding: 1.5rem;
          margin: 0;
          color: #5a6c7d;
          line-height: 1.6;
        }

        .contact-form {
          background: white;
          padding: 2.5rem;
          border-radius: 16px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          border: 1px solid #e9ecef;
          height: fit-content;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .form-input {
          width: 100%;
          padding: 1rem;
          border: 2px solid #e9ecef;
          border-radius: 8px;
          font-size: 1rem;
          font-family: inherit;
          margin-bottom: 1.5rem;
          transition: border-color 0.2s ease;
        }

        .form-input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        textarea {
          width: 100%;
          padding: 1rem;
          border: 2px solid #e9ecef;
          border-radius: 8px;
          font-size: 1rem;
          font-family: inherit;
          resize: vertical;
          margin-bottom: 1.5rem;
          transition: border-color 0.2s ease;
        }

        textarea:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .success-message {
          background: #d4edda;
          color: #155724;
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1.5rem;
          border: 1px solid #c3e6cb;
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

          .contact-content {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .info-cards {
            grid-template-columns: 1fr;
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .contact-form {
            padding: 2rem 1.5rem;
          }
        }
      `}</style>
    </>
  );
}