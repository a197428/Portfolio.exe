import { type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { LocaleSwitch } from '@/components/controls/LocaleSwitch';
import BackgroundPaths from '@/components/kokonutui/background-paths';
import { BobLauncher } from '@/features/bob/BobLauncher';

export function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="site-shell">
      <BackgroundPaths />
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <header className="topbar glass-panel">
        <Link className="wordmark" to="/" aria-label="Portfolio.exe home">
          portfolio<span>.exe</span>
        </Link>
        <LocaleSwitch />
      </header>
      <main>{children}</main>
      <BobLauncher />
    </div>
  );
}
