import { FiSun, FiMoon } from 'react-icons/fi';
import './ThemeToggle.css';

/**
 * Modern glassmorphic theme toggle switch for switching between Dark and Light mode.
 * Uses pure SVG Feather icons (FiSun, FiMoon) with animated sliding thumb and rotation transitions.
 */
export default function ThemeToggle({ theme, toggleTheme, className = '' }) {
  const isDark = theme === 'dark';

  return (
    <button
      id="theme-toggle-switch"
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`theme-toggle-switch ${isDark ? 'is-dark' : 'is-light'} ${className}`}
      onClick={toggleTheme}
    >
      <span className="theme-toggle-track">
        {/* Track ambient SVG icons */}
        <span className="track-icon track-icon--sun" aria-hidden="true">
          <FiSun size={12} />
        </span>
        <span className="track-icon track-icon--moon" aria-hidden="true">
          <FiMoon size={11} />
        </span>

        {/* Sliding thumb knob with pure SVG icons */}
        <span className="theme-toggle-thumb">
          <span className="thumb-icon-container" aria-hidden="true">
            <FiSun size={14} className="thumb-icon thumb-icon--sun" />
            <FiMoon size={14} className="thumb-icon thumb-icon--moon" />
          </span>
        </span>
      </span>
    </button>
  );
}
