import { useState, useRef } from 'react';
import SpotlightCard from '../SpotlightCard/SpotlightCard';
import { FiMail, FiGithub, FiLinkedin, FiSend, FiLoader, FiCheck, FiAlertCircle, FiMessageSquare } from 'react-icons/fi';
import './ContactForm.css';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [statusMsg, setStatusMsg] = useState('');
  const formRef = useRef(null);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    setStatusMsg('');

    try {
      // Send directly via AJAX without redirecting the user or opening a mail client
      const response = await fetch('https://formsubmit.co/ajax/san_robin@outlook.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          _subject: formData.subject || `New message from ${formData.name} via Portfolio`,
          message: formData.message,
          _template: 'table',
          _captcha: 'false'
        })
      });

      const data = await response.json();

      if (response.ok && (data.success === 'true' || data.success === true || data.message)) {
        setStatus('sent');
        setStatusMsg('Your message was sent automatically! I will get back to you soon.');
        setFormData({ name: '', email: '', subject: '', message: '' });
        setTimeout(() => {
          setStatus('idle');
          setStatusMsg('');
        }, 6000);
      } else {
        throw new Error(data.message || 'Server error occurred while sending message.');
      }
    } catch (err) {
      console.error('Contact form submission error:', err);
      setStatus('error');
      setStatusMsg('Could not send message automatically. Please try again or email me directly at san_robin@outlook.com');
      setTimeout(() => {
        setStatus('idle');
      }, 7000);
    }
  };

  return (
    <div className="contact-form-wrapper">
      <div className="contact-form-grid">
        {/* Contact Info Side */}
        <SpotlightCard spotlightColor="rgba(220, 20, 60, 0.12)" className="contact-info-card">
          <div className="contact-info">
            <div className="contact-info-icon">
              <FiMessageSquare size={32} />
            </div>
            <h3 className="contact-info-title">Let&apos;s Connect</h3>
            <p className="contact-info-desc">
              Send me a message directly using the form, or reach out through any of the channels below.
            </p>
            <div className="contact-methods">
              <a href="mailto:san_robin@outlook.com" className="contact-method">
                <span className="contact-method-icon">
                  <FiMail size={16} />
                </span>
                <div>
                  <div className="contact-method-label">Email</div>
                  <div className="contact-method-value">san_robin@outlook.com</div>
                </div>
              </a>
              <a href="https://github.com/sanrobin" target="_blank" rel="noopener noreferrer" className="contact-method">
                <span className="contact-method-icon">
                  <FiGithub size={16} />
                </span>
                <div>
                  <div className="contact-method-label">GitHub</div>
                  <div className="contact-method-value">@sanrobin</div>
                </div>
              </a>
              <a href="https://linkedin.com/in/sanrobin" target="_blank" rel="noopener noreferrer" className="contact-method">
                <span className="contact-method-icon">
                  <FiLinkedin size={16} />
                </span>
                <div>
                  <div className="contact-method-label">LinkedIn</div>
                  <div className="contact-method-value">in/sanrobin</div>
                </div>
              </a>
            </div>
          </div>
        </SpotlightCard>

        {/* Form Side */}
        <SpotlightCard spotlightColor="rgba(232, 117, 26, 0.12)" className="contact-form-card">
          <form ref={formRef} className="contact-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="contact-name" className="form-label">Name</label>
                <input
                  id="contact-name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  required
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label htmlFor="contact-email" className="form-label">Email</label>
                <input
                  id="contact-email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  className="form-input"
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="contact-subject" className="form-label">Subject</label>
              <input
                id="contact-subject"
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="What's this about?"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="contact-message" className="form-label">Message</label>
              <textarea
                id="contact-message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell me about your project, idea, or just say hi..."
                required
                rows={5}
                className="form-input form-textarea"
              />
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className={`form-submit ${status === 'sending' ? 'form-submit--sending' : ''} ${status === 'sent' ? 'form-submit--sent' : ''} ${status === 'error' ? 'form-submit--error' : ''}`}
                disabled={status === 'sending'}
              >
                {status === 'idle' && (
                  <>
                    <FiSend size={15} /> <span>Send Message</span>
                  </>
                )}
                {status === 'sending' && (
                  <>
                    <FiLoader size={15} className="spin" /> <span>Sending automatically...</span>
                  </>
                )}
                {status === 'sent' && (
                  <>
                    <FiCheck size={15} /> <span>Message Sent!</span>
                  </>
                )}
                {status === 'error' && (
                  <>
                    <FiAlertCircle size={15} /> <span>Try Again</span>
                  </>
                )}
              </button>

              {statusMsg && (
                <div className={`form-feedback form-feedback--${status}`}>
                  {status === 'sent' && <FiCheck size={15} />}
                  {status === 'error' && <FiAlertCircle size={15} />}
                  <span>{statusMsg}</span>
                </div>
              )}
            </div>
          </form>
        </SpotlightCard>
      </div>
    </div>
  );
};

export default ContactForm;
