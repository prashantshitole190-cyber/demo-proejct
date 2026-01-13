import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="content-container">
      <Link to="/" className="back-button">
        ← Back to Home
      </Link>
      
      <div className="about-container">
        <h1 className="page-title">About Medium Clone</h1>
        
        <div className="about-section">
          <h2>Our Mission</h2>
          <p>
            Medium Clone is a modern content publishing platform designed to empower writers and readers 
            to share ideas, stories, and knowledge. We believe in the power of words to inspire, educate, 
            and connect people from all walks of life.
          </p>
        </div>

        <div className="about-section">
          <h2>What We Offer</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">✍️</div>
              <h3>Rich Writing Experience</h3>
              <p>Create beautiful articles with our intuitive editor, complete with image uploads and formatting options.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">👥</div>
              <h3>Community Engagement</h3>
              <p>Connect with fellow writers and readers through follows, claps, comments, and bookmarks.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🔔</div>
              <h3>Real-time Notifications</h3>
              <p>Stay updated with instant notifications for interactions, new followers, and article responses.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>Mobile Responsive</h3>
              <p>Access your content and community from any device with our fully responsive design.</p>
            </div>
          </div>
        </div>

        <div className="about-section">
          <h2>Our Team</h2>
          <div className="team-grid">
            <div className="team-member">
              <div className="member-avatar">👨‍💻</div>
              <h3>Development Team</h3>
              <p>Full-stack developers passionate about creating exceptional user experiences.</p>
            </div>
            
            <div className="team-member">
              <div className="member-avatar">🎨</div>
              <h3>Design Team</h3>
              <p>UI/UX designers focused on creating intuitive and beautiful interfaces.</p>
            </div>
            
            <div className="team-member">
              <div className="member-avatar">📝</div>
              <h3>Content Team</h3>
              <p>Writers and editors helping to curate and promote quality content.</p>
            </div>
          </div>
        </div>

        <div className="about-section">
          <h2>Technology Stack</h2>
          <div className="tech-stack">
            <div className="tech-category">
              <h3>Frontend</h3>
              <ul>
                <li>React.js</li>
                <li>React Router</li>
                <li>CSS3</li>
                <li>Responsive Design</li>
              </ul>
            </div>
            
            <div className="tech-category">
              <h3>Backend</h3>
              <ul>
                <li>Django REST Framework</li>
                <li>PostgreSQL</li>
                <li>Redis</li>
                <li>Celery</li>
              </ul>
            </div>
            
            <div className="tech-category">
              <h3>Features</h3>
              <ul>
                <li>Token Authentication</li>
                <li>Real-time Notifications</li>
                <li>Image Processing</li>
                <li>Search & Filtering</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="about-section">
          <h2>Contact Us</h2>
          <div className="contact-grid">
            <div className="contact-item">
              <div className="contact-icon">📧</div>
              <h3>Email</h3>
              <p>hello@mediumclone.com</p>
            </div>
            
            <div className="contact-item">
              <div className="contact-icon">🐦</div>
              <h3>Twitter</h3>
              <p>@mediumclone</p>
            </div>
            
            <div className="contact-item">
              <div className="contact-icon">💼</div>
              <h3>LinkedIn</h3>
              <p>Medium Clone Platform</p>
            </div>
            
            <div className="contact-item">
              <div className="contact-icon">🌐</div>
              <h3>Website</h3>
              <p>www.mediumclone.com</p>
            </div>
          </div>
        </div>

        <div className="about-section">
          <h2>Join Our Community</h2>
          <p>
            Ready to start your writing journey? Join thousands of writers and readers who are already 
            part of our growing community. Share your stories, discover new perspectives, and connect 
            with like-minded individuals.
          </p>
          <div className="cta-buttons">
            <Link to="/register" className="btn-primary">Get Started</Link>
            <Link to="/write" className="btn-secondary">Start Writing</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;