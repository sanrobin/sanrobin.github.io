import { useState, useEffect, useRef, useCallback } from 'react';
import LiquidEther from './components/LiquidEther/LiquidEther';
import SpotlightCard from './components/SpotlightCard/SpotlightCard';
import ClickSpark from './components/ClickSpark/ClickSpark';
import Dock from './components/Dock/Dock';
import ProfileCard from './components/ProfileCard/ProfileCard';
import StrokeText from './components/StrokeText/StrokeText';
import ContactForm from './components/ContactForm/ContactForm';
import SpecularButton from './components/SpecularButton/SpecularButton';
import {
  FiSun,
  FiMoon,
  FiHome,
  FiUser,
  FiCode,
  FiBriefcase,
  FiLayers,
  FiCloud,
  FiCpu,
  FiTool,
  FiUsers,
  FiShield,
  FiGlobe,
  FiTerminal,
  FiVideo,
  FiHeadphones,
  FiDatabase,
  FiAward,
  FiTarget,
  FiMail,
  FiGithub,
  FiLinkedin,
  FiCheckCircle,
  FiHeart,
  FiCompass,
  FiLock
} from 'react-icons/fi';
import './App.css';

/* ── Dynamic Data from CMS JSON ──────────────────── */

import bioData from '../content/bio.json';
import projectsData from '../content/projects.json';
import experienceData from '../content/experience.json';

const skills = bioData?.skills || [];
const certifications = bioData?.certifications || [];
const interests = bioData?.interests || [];
const experienceList = Array.isArray(experienceData) ? experienceData : (experienceData?.experience || []);
const projectsList = Array.isArray(projectsData) ? projectsData : (projectsData?.projects || []);

/* ── Monochrome Icon Helper ────────────────────────── */

function MonochromeIcon({ name, size = 20, className = '' }) {
  const iconMap = {
    code: <FiCode size={size} className={className} />,
    cloud: <FiCloud size={size} className={className} />,
    database: <FiDatabase size={size} className={className} />,
    cpu: <FiCpu size={size} className={className} />,
    hardware: <FiCpu size={size} className={className} />,
    tool: <FiTool size={size} className={className} />,
    users: <FiUsers size={size} className={className} />,
    shield: <FiShield size={size} className={className} />,
    globe: <FiGlobe size={size} className={className} />,
    terminal: <FiTerminal size={size} className={className} />,
    video: <FiVideo size={size} className={className} />,
    headphones: <FiHeadphones size={size} className={className} />,
    target: <FiTarget size={size} className={className} />,
    award: <FiAward size={size} className={className} />,
    mail: <FiMail size={size} className={className} />,
    github: <FiGithub size={size} className={className} />,
    linkedin: <FiLinkedin size={size} className={className} />
  };

  return iconMap[name] || <FiCode size={size} className={className} />;
}

/* ── Theme Hook ────────────────────────────────────── */

function useTheme() {
  const [theme, setTheme] = useState(() => {
    // Check localStorage first, then OS preference
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('portfolio-theme');
      if (stored === 'light' || stored === 'dark') return stored;
      if (window.matchMedia('(prefers-color-scheme: light)').matches) return 'light';
    }
    return 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Listen for OS theme changes (only when user hasn't manually set a preference)
  useEffect(() => {
    const mql = window.matchMedia('(prefers-color-scheme: light)');
    const handleChange = (e) => {
      const stored = localStorage.getItem('portfolio-theme');
      // Only auto-switch if user hasn't manually toggled
      if (!stored) {
        setTheme(e.matches ? 'light' : 'dark');
      }
    };
    mql.addEventListener('change', handleChange);
    return () => mql.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(prev => {
      const next = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('portfolio-theme', next);
      return next;
    });
  }, []);

  return { theme, toggleTheme };
}

/* ── Dock Navigation (All Sections) ───────────────── */

const dockItems = [
  { icon: <FiHome size={18} />, label: 'Home', onClick: () => document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth' }) },
  { icon: <FiUser size={18} />, label: 'About', onClick: () => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }) },
  { icon: <FiCode size={18} />, label: 'Skills', onClick: () => document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth' }) },
  { icon: <FiBriefcase size={18} />, label: 'Experience', onClick: () => document.getElementById('experience')?.scrollIntoView({ behavior: 'smooth' }) },
  { icon: <FiLayers size={18} />, label: 'Projects', onClick: () => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' }) },
  { icon: <FiAward size={18} />, label: 'Certs', onClick: () => document.getElementById('certifications')?.scrollIntoView({ behavior: 'smooth' }) },
  { icon: <FiCompass size={18} />, label: 'Interests', onClick: () => document.getElementById('interests')?.scrollIntoView({ behavior: 'smooth' }) },
  { icon: <FiMail size={18} />, label: 'Contact', onClick: () => document.getElementById('reachout')?.scrollIntoView({ behavior: 'smooth' }) },
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
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNavClick = useCallback(() => setMenuOpen(false), []);

  return (
    <ClickSpark sparkColor="#FF6B6B" sparkSize={12} sparkRadius={20} sparkCount={10} duration={500}>
      {/* Theme Toggle — Top Left with Frosted Look */}
      <div className="theme-toggle">
        <SpecularButton
          size="sm"
          radius={14}
          tint={theme === 'dark' ? '#0d0d14' : '#ffffff'}
          tintOpacity={theme === 'dark' ? 0.65 : 0.75}
          blur={20}
          textColor={theme === 'dark' ? '#f0eef6' : '#1A1A2E'}
          lineColor={theme === 'dark' ? '#DC143C' : '#B91C3A'}
          baseColor={theme === 'dark' ? '#444444' : '#bbbbbb'}
          intensity={1.2}
          shineSize={14}
          shineFade={40}
          thickness={1.2}
          speed={0.35}
          followMouse
          proximity={200}
          autoAnimate={false}
          onClick={toggleTheme}
          className="theme-toggle-btn"
        >
          <span className="theme-toggle-icon">
            {theme === 'dark' ? (
              <>
                <FiSun size={14} /> <span>Switch to Light</span>
              </>
            ) : (
              <>
                <FiMoon size={14} /> <span>Switch to Dark</span>
              </>
            )}
          </span>
        </SpecularButton>
      </div>

      {/* Fixed LiquidEther Background */}
      <div className="liquid-bg">
        <LiquidEther
          colors={['#DC143C', '#E8751A', '#FF6B6B']}
          mouseForce={20}
          cursorSize={100}
          resolution={0.5}
          isBounce
          autoDemo={true}
          autoSpeed={0.3}
          autoIntensity={0.8}
          takeoverDuration={0.25}
          autoResumeDelay={3000}
          autoRampDuration={0.6}
        />
      </div>

      {/* Navigation Dock (Themed & Comprehensive) */}
      <Dock 
        items={dockItems}
        panelHeight={66}
        baseItemSize={44}
        magnification={60}
        distance={140}
      />

      {/* Hero */}
      <section className="hero" id="hero">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="dot"></span>
            Available for collaborations
          </div>
          <div className="hero-stroke-title">
            <StrokeText
              text="Sanjay Maheswaran"
              strokeColor="#DC143C"
              fillColor={theme === 'dark' ? '#F8FAFC' : '#1A1A2E'}
              strokeWidth={1.4}
              drawDuration={1.6}
              fillDelay={0.2}
              stagger={0.05}
              ease="power2.out"
              trigger="mount"
              fillMode="wipe"
              fontSize={128}
              fontWeight={800}
              letterSpacing={-4}
            />
          </div>
          <p className="hero-subtitle">
            {bioData.heroSubtitle}
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

      <AnimatedSection id="about">
        <div className="about-container">
          <div className="about-top">
            <div className="about-text">
              <div className="section-header">
                <span className="section-label">// About Me</span>
                <h2 className="section-title">
                  Hey, I&apos;m <span className="gradient-text">{bioData.name.split(' ')[0]}</span>
                </h2>
              </div>
              {bioData.aboutParagraphs.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
            <div className="about-profile">
              <ProfileCard
                name={bioData.name.split(' ')[0] + ' ' + (bioData.name.split(' ')[1]?.charAt(0) || '')}
                title={bioData.title}
                handle={bioData.handle}
                status={bioData.status}
                contactText="Contact Me"
                avatarUrl="/itz_me.png"
                miniAvatarUrl="/snap_profile.png"
                showUserInfo={true}
                enableTilt={true}
                enableMobileTilt={false}
                onContactClick={() => window.location.href = `mailto:${bioData.email}`}
                behindGlowEnabled
                behindGlowColor="rgba(220, 20, 60, 0.65)"
              />
            </div>
          </div>
          <div className="about-highlights-horizontal">
            <SpotlightCard spotlightColor="rgba(220, 20, 60, 0.15)">
              <div className="highlight-item">
                <div className="highlight-icon">
                  <FiAward size={20} />
                </div>
                <div>
                  <div className="highlight-label">Education</div>
                  <div className="highlight-value">
                    {bioData.education}
                  </div>
                </div>
              </div>
            </SpotlightCard>
            <SpotlightCard spotlightColor="rgba(232, 117, 26, 0.15)">
              <div className="highlight-item">
                <div className="highlight-icon">
                  <FiTarget size={20} />
                </div>
                <div>
                  <div className="highlight-label">Current Focus</div>
                  <div className="highlight-value">
                    {bioData.currentFocus}
                  </div>
                </div>
              </div>
            </SpotlightCard>
            <SpotlightCard spotlightColor="rgba(255, 107, 107, 0.15)">
              <div className="highlight-item">
                <div className="highlight-icon">
                  <FiGlobe size={20} />
                </div>
                <div>
                  <div className="highlight-label">Languages</div>
                  <div className="highlight-value">
                    {bioData.languages}
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
            <SpotlightCard key={cat.title} spotlightColor="rgba(220, 20, 60, 0.15)">
              <div className="skill-card-title">
                <span className="skill-card-icon">
                  <MonochromeIcon name={cat.icon} size={18} />
                </span>
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
          {experienceList.map((exp, i) => (
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
          {projectsList.map((proj, i) => (
            <SpotlightCard key={i} spotlightColor="rgba(232, 117, 26, 0.12)">
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
            <SpotlightCard key={i} spotlightColor="rgba(255, 107, 107, 0.15)">
              <div className="cert-category">
                <span className="cert-category-icon">
                  <MonochromeIcon name={cert.icon} size={16} />
                </span>
                {cert.category}
              </div>
              <ul className="cert-list">
                {cert.items.map((item, j) => (
                  <li key={j}>
                    <FiCheckCircle size={14} className="cert-icon" />
                    <span>{item}</span>
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
            <SpotlightCard key={i} spotlightColor="rgba(220, 20, 60, 0.1)">
              <div className="interest-icon-wrapper">
                <MonochromeIcon name={item.icon} size={28} className="interest-icon" />
              </div>
              <div className="interest-title">{item.title}</div>
              <div className="interest-desc">{item.desc}</div>
            </SpotlightCard>
          ))}
        </div>
      </AnimatedSection>

      {/* Reach Out — Contact Form */}
      <section className="reachout-section" id="reachout">
        <div className="reachout-container">
          <div className="section-header" style={{ textAlign: 'center' }}>
            <span className="section-label">// Get In Touch</span>
            <h2 className="section-title">Reach Out</h2>
            <p className="section-desc" style={{ margin: '0 auto' }}>
              Interested in collaborating, hiring, or just saying hello? Drop me a message.
            </p>
          </div>
          <ContactForm />
        </div>
      </section>

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
              <FiGithub size={15} /> <span>GitHub</span>
            </a>
            <a
              href="https://linkedin.com/in/sanrobin"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
            >
              <FiLinkedin size={15} /> <span>LinkedIn</span>
            </a>
            <a href={`mailto:${bioData.email}`} className="footer-link">
              <FiMail size={15} /> <span>Email</span>
            </a>
          </div>
          <div className="footer-bottom">
            <p className="footer-copy">
              © {new Date().getFullYear()} {bioData.name}. Built with{' '}
              <FiHeart size={13} className="heart" /> and React
            </p>
            <a href="/admin" className="footer-login-btn" title="Admin Login / Content Manager">
              <FiLock size={12} /> <span>Admin Login</span>
            </a>
          </div>
        </div>
      </footer>
    </ClickSpark>
  );
}
