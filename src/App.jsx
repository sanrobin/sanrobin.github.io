import { useState, useEffect, useRef, useCallback } from 'react';
import LiquidEther from './components/LiquidEther/LiquidEther';
import SpotlightCard from './components/SpotlightCard/SpotlightCard';
import ClickSpark from './components/ClickSpark/ClickSpark';
import './App.css';

/* ── Data ──────────────────────────────────────────── */

const skills = [
  {
    icon: '💻',
    title: 'Programming Languages',
    items: ['Python', 'Java', 'C', 'Embedded C', 'HTML', 'CSS', 'JavaScript'],
  },
  {
    icon: '☁️',
    title: 'Cloud & Architecture',
    items: ['AWS Cloud Foundations', 'Serverless Concepts', 'IoT Integration'],
  },
  {
    icon: '🧠',
    title: 'Data & AI/ML',
    items: ['MySQL', 'scikit-learn', 'pandas', 'NLTK', 'Google Gemini API'],
  },
  {
    icon: '🔌',
    title: 'Hardware & Edge',
    items: ['ESP32', 'Raspberry Pi 5', 'GSM/GPS Modules', 'Audio/Camera Modules'],
  },
  {
    icon: '🛠️',
    title: 'Tools & Platforms',
    items: ['Git', 'VS Code', 'Android Studio', 'Linux Environments', 'Windows'],
  },
  {
    icon: '🎯',
    title: 'Soft Skills & Leadership',
    items: ['Team Leadership', 'Public Speaking', 'Collaborative Problem Solving'],
  },
];

const experience = [
  {
    date: 'February 2026 – Present',
    title: 'Tech Team Lead',
    org: 'AWS Student Builder Group AURCM',
    location: 'Madurai, India',
    points: [
      'Directing technical initiatives, student study groups, and hands-on workshops centered on AWS cloud architecture.',
      'Fostering a campus-wide culture of cloud literacy, practical experimentation, and peer-led learning.',
    ],
  },
  {
    date: 'July 2025 – February 2026',
    title: 'Tech Team Volunteer',
    org: 'AWS Cloud Club AURCM',
    location: 'Madurai, India',
    points: [
      'Supported infrastructure setup, live demos, and technical troubleshooting for large-scale campus events.',
      'Contributed to the successful execution of AWS Student Community Day and Amazon Q workshops.',
    ],
  },
  {
    date: 'January 2025 – March 2025',
    title: 'Cyber Security Intern',
    org: 'LearnTechzo',
    location: 'Remote',
    points: [
      'Conducted remote security audits and system vulnerability assessments on web and network architectures.',
      'Implemented defensive security measures and designed privacy-conscious system improvements.',
    ],
  },
];

const projects = [
  {
    date: 'March 2026 – Present',
    title: 'GPS + IoT-Based Vehicle Monitoring System',
    concept: 'A real-time hardware and software telemetry tracking solution for vehicle logistics.',
    desc: 'Integrates an ESP32 microcontroller with GPS antenna and GSM modules to continuously monitor geographic location, route history, and payload weight changes.',
    tech: ['Embedded C', 'ESP32', 'GPS Antenna', 'GSM Module', 'HTML', 'CSS', 'Python', 'MySQL'],
  },
  {
    date: 'December 2024 – July 2025',
    title: 'Welcome Robot Assistant',
    concept: 'An interactive, edge-AI desk assistant powered by a Raspberry Pi 5.',
    desc: 'Employs Vosk for offline speech recognition, Google Gemini for intelligent conversational responses, and ElevenLabs APIs for lifelike voice synthesis.',
    tech: ['Python', 'Gemini API', 'ElevenLabs API', 'Vosk', 'Raspberry Pi 5', 'Camera Module 3'],
  },
  {
    date: 'October 2025 – December 2025',
    title: 'Text Cleaning & Preprocessing Utility',
    concept: 'A dedicated NLP tool that cleans and standardizes raw text.',
    desc: 'Automates the ingestion of DOCX and PDF documents, performing tokenization, stopword removal, and lemmatization for normalized dataset generation.',
    tech: ['Python', 'NLTK'],
  },
  {
    date: 'September 2025 – November 2025',
    title: 'IBM-Styled Login & Authentication Portal',
    concept: 'A modern, accessible front-end authentication experience.',
    desc: 'Engineered an IBM-inspired visual layout with a strong emphasis on clean UI/UX principles, responsiveness, and web accessibility standards.',
    tech: ['Python', 'HTML', 'CSS', 'JavaScript'],
  },
  {
    date: 'April 2025 – May 2025',
    title: 'Mushroom Classification ML Model',
    concept: 'A supervised classification model to distinguish edible from poisonous mushrooms.',
    desc: 'Implements the ID3 Decision Tree algorithm to evaluate biological dataset attributes with high accuracy.',
    tech: ['Python', 'scikit-learn', 'pandas'],
  },
];

const certifications = [
  {
    category: 'Cloud & Modern Infrastructure',
    icon: '☁️',
    items: [
      'AWS Cloud Quest: Cloud Practitioner',
      'AWS Student Community Day South TN',
      'Amazon Q Workshop Participation',
    ],
  },
  {
    category: 'Cybersecurity & Web Technologies',
    icon: '🔒',
    items: [
      'NPTEL Certification in Cyber Security and Privacy',
      'IBM Front-End Technologies Training Program',
      'LearnTechzo Cyber Security Internship Certificate',
    ],
  },
  {
    category: 'Global Communication',
    icon: '🌍',
    items: ['IELTS Score: 7.5 — Professional English Proficiency'],
  },
];

const interests = [
  {
    icon: '🐧',
    title: 'Linux & OS Experimentation',
    desc: 'Customizing open-source operating systems, tinkering with system interfaces, and exploring desktop environments.',
  },
  {
    icon: '🏴‍☠️',
    title: 'Cybersecurity & CTF',
    desc: 'Challenging my understanding of system security through practical challenges and vulnerability analysis.',
  },
  {
    icon: '🎬',
    title: 'Digital Content Creation',
    desc: 'Combining technical storytelling with visual media to produce engaging multimedia content.',
  },
  {
    icon: '🎧',
    title: 'Audio Equipment & Gaming',
    desc: 'Appreciating high-fidelity audio formats and exploring immersive open-world gaming experiences.',
  },
];

const navItems = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Certs', href: '#certifications' },
];

/* ── Scroll animation hook ──────────────────────── */

function useScrollReveal() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('visible');
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return ref;
}

function AnimatedSection({ children, className = '', id }) {
  const ref = useScrollReveal();
  return (
    <section ref={ref} id={id} className={`section animate-on-scroll ${className}`}>
      <div className="section-container">{children}</div>
    </section>
  );
}

/* ── App ────────────────────────────────────────────── */

export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNavClick = useCallback(() => setMenuOpen(false), []);

  return (
    <ClickSpark sparkColor="#B497CF" sparkSize={12} sparkRadius={20} sparkCount={10} duration={500}>
      {/* Fixed LiquidEther Background */}
      <div className="liquid-bg">
        <LiquidEther
          colors={['#5227FF', '#FF9FFC', '#B497CF']}
          mouseForce={20}
          cursorSize={100}
          resolution={0.5}
          isBounce
          autoDemo={true}
          autoSpeed={0.5}
          autoIntensity={2.2}
          takeoverDuration={0.25}
          autoResumeDelay={3000}
          autoRampDuration={0.6}
        />
      </div>

      {/* Navigation */}
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`} id="navbar">
        <div className="nav-logo">
          <span className="gradient-text">SM</span>
        </div>
        <button className="nav-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">
          <span></span>
          <span></span>
          <span></span>
        </button>
        <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
          {navItems.map((item) => (
            <li key={item.href}>
              <a href={item.href} onClick={handleNavClick}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Hero */}
      <section className="hero" id="hero">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="dot"></span>
            Available for collaborations
          </div>
          <h1>
            <span className="gradient-text">Sanjay</span>
            <br />
            Maheswaran
          </h1>
          <p className="hero-subtitle">
            Computer Science &amp; Engineering Student · Cloud Architecture Advocate · Full-Stack &amp; IoT Developer
          </p>
          <div className="hero-cta">
            <a href="#projects" className="btn btn-primary">
              View Projects ↓
            </a>
            <a href="#about" className="btn btn-outline">
              About Me
            </a>
          </div>
        </div>
        <div className="scroll-indicator">
          <div className="mouse"></div>
          <span>Scroll</span>
        </div>
      </section>

      {/* About */}
      <AnimatedSection id="about">
        <div className="section-header">
          <span className="section-label">// About Me</span>
          <h2 className="section-title">
            Hey, I&apos;m <span className="gradient-text">Sanjay</span> 👋
          </h2>
        </div>
        <div className="about-grid">
          <div className="about-text">
            <p>
              Based in Tamil Nadu, India, I am an ambitious Computer Science undergraduate at Anna University
              Regional Campus Madurai. My work spans the complete software development spectrum—from low-level
              Embedded C and IoT hardware to Python-based machine learning models and natural language processing
              tools.
            </p>
            <p>
              I thrive at the intersection of systems experimentation and practical application. Whether I am
              optimizing Linux desktop environments, auditing system security, or directing campus-wide cloud
              literacy workshops, I love turning complex technical challenges into intuitive, user-friendly
              solutions.
            </p>
          </div>
          <div className="about-highlights">
            <SpotlightCard spotlightColor="rgba(82, 39, 255, 0.15)">
              <div className="highlight-item">
                <div className="highlight-icon">🎓</div>
                <div>
                  <div className="highlight-label">Education</div>
                  <div className="highlight-value">
                    B.E. in CSE, Anna University Regional Campus Madurai (2023 – Present)
                  </div>
                </div>
              </div>
            </SpotlightCard>
            <SpotlightCard spotlightColor="rgba(255, 159, 252, 0.15)">
              <div className="highlight-item">
                <div className="highlight-icon">🎯</div>
                <div>
                  <div className="highlight-label">Current Focus</div>
                  <div className="highlight-value">
                    Leading AWS cloud workshops & engineering real-time IoT vehicle tracking
                  </div>
                </div>
              </div>
            </SpotlightCard>
            <SpotlightCard spotlightColor="rgba(180, 151, 207, 0.15)">
              <div className="highlight-item">
                <div className="highlight-icon">🌐</div>
                <div>
                  <div className="highlight-label">Languages</div>
                  <div className="highlight-value">
                    English (IELTS 7.5) · Tamil (Native) · Japanese & French (Basic)
                  </div>
                </div>
              </div>
            </SpotlightCard>
          </div>
        </div>
      </AnimatedSection>

      {/* Skills */}
      <AnimatedSection id="skills">
        <div className="section-header">
          <span className="section-label">// Technical Toolbox</span>
          <h2 className="section-title">Skills & Technologies</h2>
          <p className="section-desc">
            A structured overview of my technical capabilities and the tools I work with every day.
          </p>
        </div>
        <div className="skills-grid">
          {skills.map((cat) => (
            <SpotlightCard key={cat.title} spotlightColor="rgba(82, 39, 255, 0.15)">
              <div className="skill-card-title">
                <span className="skill-card-icon">{cat.icon}</span>
                {cat.title}
              </div>
              <div className="skill-tags">
                {cat.items.map((item) => (
                  <span key={item} className="skill-tag">
                    {item}
                  </span>
                ))}
              </div>
            </SpotlightCard>
          ))}
        </div>
      </AnimatedSection>

      {/* Experience */}
      <AnimatedSection id="experience">
        <div className="section-header">
          <span className="section-label">// Experience</span>
          <h2 className="section-title">Leadership & Professional Journey</h2>
        </div>
        <div className="timeline">
          {experience.map((exp, i) => (
            <div key={i} className="timeline-item">
              <div className="timeline-dot"></div>
              <div className="timeline-date">{exp.date}</div>
              <div className="timeline-title">{exp.title}</div>
              <div className="timeline-org">
                {exp.org} · {exp.location}
              </div>
              <ul className="timeline-desc">
                {exp.points.map((pt, j) => (
                  <li key={j}>{pt}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </AnimatedSection>

      {/* Projects */}
      <AnimatedSection id="projects">
        <div className="section-header">
          <span className="section-label">// Featured Projects</span>
          <h2 className="section-title">Things I&apos;ve Built</h2>
          <p className="section-desc">
            From hardware telemetry systems to AI-powered assistants — a showcase of my engineering work.
          </p>
        </div>
        <div className="projects-grid">
          {projects.map((proj, i) => (
            <SpotlightCard key={i} spotlightColor="rgba(255, 159, 252, 0.12)">
              <div className="project-date">{proj.date}</div>
              <div className="project-title">{proj.title}</div>
              <div className="project-concept">{proj.concept}</div>
              <div className="project-desc">{proj.desc}</div>
              <div className="project-tech">
                {proj.tech.map((t) => (
                  <span key={t} className="tech-tag">
                    {t}
                  </span>
                ))}
              </div>
            </SpotlightCard>
          ))}
        </div>
      </AnimatedSection>

      {/* Certifications */}
      <AnimatedSection id="certifications">
        <div className="section-header">
          <span className="section-label">// Certifications</span>
          <h2 className="section-title">Achievements & Recognition</h2>
        </div>
        <div className="certs-grid">
          {certifications.map((cert, i) => (
            <SpotlightCard key={i} spotlightColor="rgba(180, 151, 207, 0.15)">
              <div className="cert-category">
                {cert.icon} {cert.category}
              </div>
              <ul className="cert-list">
                {cert.items.map((item, j) => (
                  <li key={j}>
                    <span className="cert-icon">✦</span>
                    {item}
                  </li>
                ))}
              </ul>
            </SpotlightCard>
          ))}
        </div>
      </AnimatedSection>

      {/* Interests */}
      <AnimatedSection id="interests">
        <div className="section-header">
          <span className="section-label">// Off Duty</span>
          <h2 className="section-title">Personal Interests</h2>
          <p className="section-desc">
            When I&apos;m not writing code or managing cloud workshops, here&apos;s what sharpens my edge.
          </p>
        </div>
        <div className="interests-grid">
          {interests.map((item, i) => (
            <SpotlightCard key={i} spotlightColor="rgba(82, 39, 255, 0.1)">
              <span className="interest-icon">{item.icon}</span>
              <div className="interest-title">{item.title}</div>
              <div className="interest-desc">{item.desc}</div>
            </SpotlightCard>
          ))}
        </div>
      </AnimatedSection>

      {/* Footer */}
      <footer className="footer" id="footer">
        <div className="footer-content">
          <div className="footer-links">
            <a
              href="https://github.com/sanrobin"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
            >
              ⌘ GitHub
            </a>
            <a
              href="https://linkedin.com/in/sanrobin"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
            >
              ◉ LinkedIn
            </a>
            <a href="mailto:san_robin@outlook.com" className="footer-link">
              ✉ Email
            </a>
          </div>
          <p className="footer-copy">
            © {new Date().getFullYear()} Sanjay Maheswaran. Built with{' '}
            <span className="heart">♥</span> and React.
          </p>
        </div>
      </footer>
    </ClickSpark>
  );
}
