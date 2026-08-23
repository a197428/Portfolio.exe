import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import '@/app/i18n';
import { LocaleSwitch } from '@/components/controls/LocaleSwitch';
import { RoleSwitch } from '@/components/controls/RoleSwitch';
import { usePreferences } from '@/features/preferences/store';

describe('portfolio preferences', () => {
  beforeEach(() => {
    localStorage.clear();
    usePreferences.setState({ locale: 'en', role: 'ai' });
  });

  it('switches the portfolio role and mirrors it into the URL', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={['/']}>
        <RoleSwitch />
      </MemoryRouter>,
    );

    await user.click(screen.getByRole('button', { name: 'Frontend Developer' }));

    expect(usePreferences.getState().role).toBe('frontend');
    expect(screen.getByRole('button', { name: 'Frontend Developer' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(screen.getByRole('button', { name: 'AI Developer' })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
    expect(localStorage.getItem('portfolio-preferences')).toContain('"role":"frontend"');
  });

  it('switches the locale and persists it', async () => {
    const user = userEvent.setup();
    render(<LocaleSwitch />);

    await user.click(screen.getByRole('button', { name: 'RU' }));

    expect(usePreferences.getState().locale).toBe('ru');
    expect(localStorage.getItem('portfolio-preferences')).toContain('"locale":"ru"');
  });
});
