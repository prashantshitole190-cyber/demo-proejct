import React from 'react';
import { Link } from 'react-router-dom';

const Help = () => {
  const faqs = [
    {
      question: "How do I write and publish an article?",
      answer: "Click the 'Write' button in the header, compose your article, and click 'Publish' when ready."
    },
    {
      question: "How do I follow other writers?",
      answer: "Visit a writer's profile and click the 'Follow' button to see their articles in your feed."
    },
    {
      question: "What are claps?",
      answer: "Claps are a way to show appreciation for articles. You can clap up to 50 times per article."
    },
    {
      question: "How do I save articles for later?",
      answer: "Click the bookmark icon on any article to save it to your reading list."
    },
    {
      question: "How do I edit my profile?",
      answer: "Go to Settings from your avatar menu to update your profile information and social links."
    },
    {
      question: "How do notifications work?",
      answer: "You'll receive notifications when someone follows you, claps your articles, or comments on your posts."
    }
  ];

  return (
    <div className="content-container">
      <Link to="/" className="back-button">
        ← Back to Home
      </Link>
      
      <div className="help-container">
        <h1 className="page-title">Help Center</h1>
        
        <div className="help-section">
          <h2>Getting Started</h2>
          <p>Welcome to Medium Clone! Here's everything you need to know to get started with our platform.</p>
        </div>

        <div className="help-section">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-list">
            {faqs.map((faq, index) => (
              <div key={index} className="faq-item">
                <h3 className="faq-question">{faq.question}</h3>
                <p className="faq-answer">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="help-section">
          <h2>Platform Features</h2>
          <div className="features-overview">
            <div className="feature-item">
              <h3>📝 Writing & Publishing</h3>
              <p>Create rich articles with our intuitive editor. Add images, format text, and publish when ready.</p>
            </div>
            
            <div className="feature-item">
              <h3>👏 Claps & Engagement</h3>
              <p>Show appreciation with claps (up to 50 per article) and engage through comments.</p>
            </div>
            
            <div className="feature-item">
              <h3>🔖 Bookmarks & Reading Lists</h3>
              <p>Save articles for later reading and organize your personal library.</p>
            </div>
            
            <div className="feature-item">
              <h3>👥 Following & Feeds</h3>
              <p>Follow your favorite writers and get personalized content recommendations.</p>
            </div>
            
            <div className="feature-item">
              <h3>🔔 Real-time Notifications</h3>
              <p>Stay updated with instant notifications for all interactions and activities.</p>
            </div>
            
            <div className="feature-item">
              <h3>🔍 Search & Discovery</h3>
              <p>Find articles by keywords, topics, or authors using our powerful search.</p>
            </div>
          </div>
        </div>

        <div className="help-section">
          <h2>Keyboard Shortcuts</h2>
          <div className="shortcuts-grid">
            <div className="shortcut-item">
              <kbd>Ctrl + K</kbd>
              <span>Quick search</span>
            </div>
            <div className="shortcut-item">
              <kbd>Ctrl + Enter</kbd>
              <span>Publish article</span>
            </div>
            <div className="shortcut-item">
              <kbd>Ctrl + S</kbd>
              <span>Save draft</span>
            </div>
            <div className="shortcut-item">
              <kbd>Ctrl + B</kbd>
              <span>Bold text</span>
            </div>
            <div className="shortcut-item">
              <kbd>Ctrl + I</kbd>
              <span>Italic text</span>
            </div>
            <div className="shortcut-item">
              <kbd>Esc</kbd>
              <span>Close modals</span>
            </div>
          </div>
        </div>

        <div className="help-section">
          <h2>Troubleshooting</h2>
          <div className="troubleshooting-list">
            <div className="trouble-item">
              <h3>Can't upload images?</h3>
              <p>Make sure your image is under 5MB and in JPG, PNG, or GIF format.</p>
            </div>
            
            <div className="trouble-item">
              <h3>Articles not saving?</h3>
              <p>Check your internet connection and try refreshing the page.</p>
            </div>
            
            <div className="trouble-item">
              <h3>Notifications not working?</h3>
              <p>Enable browser notifications and check your notification settings.</p>
            </div>
            
            <div className="trouble-item">
              <h3>Search not finding articles?</h3>
              <p>Try different keywords or check spelling. Search includes titles, content, and tags.</p>
            </div>
          </div>
        </div>
        <div className="help-section">
          <h2>Writing Guidelines</h2>
          <ul className="guidelines-list">
            <li>Write original, high-quality content</li>
            <li>Use clear, engaging titles</li>
            <li>Add relevant tags to help readers find your content</li>
            <li>Include images to make your articles more engaging</li>
            <li>Engage with your readers through comments</li>
          </ul>
        </div>

        <div className="help-section">
          <h2>Community Guidelines</h2>
          <ul className="guidelines-list">
            <li>Be respectful and constructive in comments</li>
            <li>No spam or self-promotion in comments</li>
            <li>Report inappropriate content</li>
            <li>Support fellow writers with claps and follows</li>
          </ul>
        </div>

        <div className="help-section">
          <h2>Need More Help?</h2>
          <p>If you can't find what you're looking for, feel free to reach out:</p>
          <div className="contact-info">
            <p>📧 Email: support@mediumclone.com</p>
            <p>💬 Live Chat: Available 9 AM - 5 PM EST</p>
            <p>📚 Documentation: Check our detailed guides</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;