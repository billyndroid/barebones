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
                <div className="info-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/>
                    <path d="M2 6L12 13L22 6" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </div>
                <h3>Email</h3>
                <p>support@barebones.com</p>
                <p>sales@barebones.com</p>
              </div>
              <div className="info-card">
                <div className="info-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 16.92V19.92C22 20.52 21.52 21 20.92 21C10.39 21 2 12.61 2 2.08C2 1.48 2.48 1 3.08 1H6.08C6.68 1 7.16 1.48 7.16 2.08V5.08C7.16 5.68 6.68 6.16 6.08 6.16H4.23C5.56 9.63 8.37 12.44 11.84 13.77V11.92C11.84 11.32 12.32 10.84 12.92 10.84H15.92C16.52 10.84 17 11.32 17 11.92V14.92C17 15.52 16.52 16 15.92 16H12.92C12.32 16 11.84 16.48 11.84 17.08V19.92C11.84 20.52 12.32 21 12.92 21H20.92C21.52 21 22 20.52 22 19.92V16.92Z" stroke="currentColor" strokeWidth="2" fill="none"/>
                  </svg>
                </div>
                <h3>Phone</h3>
                <p>+1 (555) 123-4567</p>
                <p>Mon-Fri: 9AM-6PM EST</p>
              </div>
              <div className="info-card">
                <div className="info-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 10C21 17L12 23L3 17C3 13.134 7.134 10 12 10S21 13.134 21 17Z" stroke="currentColor" strokeWidth="2" fill="none"/>
                    <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2" fill="none"/>
                  </svg>
                </div>
                <h3>Address</h3>
                <p>123 Commerce Street</p>
                <p>Business District, NY 10001</p>
              </div>
              <div className="info-card">
                <div className="info-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" strokeWidth="2" fill="none"/>
                    <circle cx="8" cy="9" r="1" fill="currentColor"/>
                    <circle cx="12" cy="9" r="1" fill="currentColor"/>
                    <circle cx="16" cy="9" r="1" fill="currentColor"/>
                  </svg>
                </div>
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
          font-family: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
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
          font-family: 'Montserrat', sans-serif;
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
          color: #3F334D;
          margin-bottom: 2rem;
          font-family: 'Montserrat', sans-serif;
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
          color: #3F334D;
          margin-bottom: 0.5rem;
          font-size: 1.1rem;
          font-family: 'Montserrat', sans-serif;
        }

        .info-card p {
          color: #7f8c8d;
          font-size: 0.9rem;
          margin: 0.25rem 0;
        }

        .faq-section h3 {
          color: #3F334D;
          margin-bottom: 1.5rem;
          font-size: 1.5rem;
          font-family: 'Montserrat', sans-serif;
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
          color: #3F334D;
          background: #f8f9fa;
          border-bottom: 1px solid #e9ecef;
          font-family: 'Montserrat', sans-serif;
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
          border-color: #F0386B;
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
          background: rgba(240, 56, 107, 0.1);
          color: #F0386B;
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1.5rem;
          border: 1px solid rgba(240, 56, 107, 0.3);
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