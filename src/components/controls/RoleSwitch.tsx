import { BrainCircuit, PanelsTopLeft } from 'lucide-react';
import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { usePreferences, type Role } from '@/features/preferences/store';
import { useRoleUrl } from '@/features/preferences/roleUrl';

const roles: Array<{ id: Role; icon: typeof BrainCircuit }> = [
  { id: 'ai', icon: BrainCircuit },
  { id: 'frontend', icon: PanelsTopLeft },
];

/**
 * Explicitly labeled compact glass module for choosing the portfolio lens. The
 * label names the control, the segmented pill selects the role, and the caption
 * states that everything below adapts. Toggling also writes `?role=` into the
 * URL via `replace` so a copied link keeps the lens.
 */
export function RoleSwitch() {
  const { t } = useTranslation();
  const labelId = useId();
  const role = usePreferences((state) => state.role);
  const setRoleAndUrl = useRoleUrl();

  return (
    <div className="role-switch" data-role-switch>
      <div className="role-switch-head">
        <span className="role-switch-label" id={labelId}>
          {t('controls.roleLabel')}
        </span>
        <div className="segmented role-segments" role="group" aria-labelledby={labelId}>
          {roles.map(({ id, icon: Icon }) => (
            <button
              className="segment role-segment"
              data-active={role === id}
              key={id}
              onClick={() => setRoleAndUrl(id)}
              type="button"
              aria-pressed={role === id}
            >
              <Icon aria-hidden="true" size={16} />
              {t(`roles.${id}.label`)}
            </button>
          ))}
        </div>
      </div>
      <span className="role-switch-caption">{t('controls.roleCaption')}</span>
    </div>
  );
}
