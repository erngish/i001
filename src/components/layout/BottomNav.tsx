import { useAppState } from '@/store/app-context';
import type { AppView } from '@/types';
import './BottomNav.css';

const navItems: { view: AppView; label: string; icon: string }[] = [
  { view: 'wallet', label: '钱包', icon: 'wallet' },
  { view: 'stake', label: '质押', icon: 'stake' },
  { view: 'dashboard', label: '看板', icon: 'dashboard' },
  { view: 'security', label: '安风', icon: 'shield' },
];

export function BottomNav() {
  const { state, dispatch } = useAppState();

  return (
    <nav className="bottom-nav">
      <div className="bottom-nav-inner">
        {navItems.map((item) => (
          <button
            key={item.view}
            className={`nav-item ${state.currentView === item.view ? 'active' : ''}`}
            onClick={() => dispatch({ type: 'SET_VIEW', payload: item.view })}
          >
            <span className="nav-icon">
              <NavIcon type={item.icon} />
            </span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}

function NavIcon({ type }: { type: string }) {
  switch (type) {
    case 'wallet':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="5" width="20" height="14" rx="2" />
          <path d="M16 12h.01" />
          <path d="M2 10h20" />
        </svg>
      );
    case 'stake':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
      );
    case 'dashboard':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      );
    case 'shield':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      );
    default:
      return null;
  }
}
