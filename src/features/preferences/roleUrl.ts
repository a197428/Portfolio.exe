import { useNavigate } from 'react-router-dom';
import { usePreferences, type Role } from '@/features/preferences/store';

export const ROLE_URL_PARAM = 'role';

/** The only role values the public URL contract accepts. */
const VALID_ROLES: readonly Role[] = ['ai', 'frontend'];

export function isRole(value: string | null | undefined): value is Role {
  return VALID_ROLES.some((role) => role === value);
}

/**
 * Apply a valid `?role=` query parameter to the preference store before the
 * first render, so a shared link opens the right lens without a flash of the
 * default. Invalid or missing values are ignored silently: the saved setting
 * (or the `ai` default) stays in charge.
 */
export function applyRoleFromUrl(search: string): void {
  const candidate = new URLSearchParams(search).get(ROLE_URL_PARAM);
  if (!isRole(candidate)) return;
  usePreferences.setState({ role: candidate });
}

/**
 * Manual role toggle: update the store and mirror the choice into the URL with
 * `replace`, so a copied link keeps the lens but the browser history does not
 * accumulate an entry per switch. React Router resolves the bare query against
 * the current path, so the page neither reloads nor loses its route.
 */
export function useRoleUrl() {
  const navigate = useNavigate();
  const setRole = usePreferences((state) => state.setRole);

  return (role: Role) => {
    setRole(role);
    navigate(`?${ROLE_URL_PARAM}=${role}`, { replace: true });
  };
}
