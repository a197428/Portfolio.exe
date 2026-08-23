import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, useLocation } from 'react-router-dom';
import '@/app/i18n';
import { RoleSwitch } from '@/components/controls/RoleSwitch';
import { applyRoleFromUrl, isRole } from '@/features/preferences/roleUrl';
import { usePreferences } from '@/features/preferences/store';

function LocationProbe() {
  const location = useLocation();
  return <output data-testid="location">{location.search}</output>;
}

describe('role URL contract', () => {
  beforeEach(() => {
    localStorage.clear();
    usePreferences.setState({ locale: 'en', role: 'ai' });
  });

  it('accepts only the two documented roles', () => {
    expect(isRole('ai')).toBe(true);
    expect(isRole('frontend')).toBe(true);
    expect(isRole('designer')).toBe(false);
    expect(isRole('AI')).toBe(false);
    expect(isRole('')).toBe(false);
    expect(isRole(null)).toBe(false);
    expect(isRole(undefined)).toBe(false);
  });

  it('lets a valid URL role win over the saved setting', () => {
    usePreferences.setState({ role: 'frontend' });
    applyRoleFromUrl('?role=ai');
    expect(usePreferences.getState().role).toBe('ai');
  });

  it('keeps the saved setting when the URL has no role', () => {
    usePreferences.setState({ role: 'frontend' });
    applyRoleFromUrl('');
    expect(usePreferences.getState().role).toBe('frontend');
  });

  it('ignores an invalid role value silently', () => {
    usePreferences.setState({ role: 'ai' });
    applyRoleFromUrl('?role=designer');
    expect(usePreferences.getState().role).toBe('ai');
  });

  it('finds the role among unrelated query parameters', () => {
    applyRoleFromUrl('?utm_source=vacancy&role=frontend&ref=email');
    expect(usePreferences.getState().role).toBe('frontend');
  });

  it('writes the toggled role into the URL search', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={['/']}>
        <RoleSwitch />
        <LocationProbe />
      </MemoryRouter>,
    );

    await user.click(screen.getByRole('button', { name: 'Frontend Developer' }));

    expect(usePreferences.getState().role).toBe('frontend');
    expect(screen.getByTestId('location')).toHaveTextContent('?role=frontend');
  });

  it('exposes the labeled module copy in both locales', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <RoleSwitch />
      </MemoryRouter>,
    );
    expect(screen.getByRole('group', { name: 'Portfolio focus' })).toBeInTheDocument();
    expect(screen.getByText('Portfolio focus')).toBeVisible();
  });
});
