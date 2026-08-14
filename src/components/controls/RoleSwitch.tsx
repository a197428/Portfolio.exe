import { BrainCircuit, PanelsTopLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { usePreferences, type Role } from '@/features/preferences/store';

const roles: Array<{ id: Role; icon: typeof BrainCircuit }> = [
  { id: 'ai', icon: BrainCircuit },
  { id: 'frontend', icon: PanelsTopLeft },
];

export function RoleSwitch() {
  const { t } = useTranslation();
  const role = usePreferences((state) => state.role);
  const setRole = usePreferences((state) => state.setRole);

  return (
    <div className="segmented role-switch" role="group" aria-label={t('controls.role')}>
      {roles.map(({ id, icon: Icon }) => (
        <button
          className="segment role-segment"
          data-active={role === id}
          key={id}
          onClick={() => setRole(id)}
          type="button"
          aria-pressed={role === id}
        >
          <Icon aria-hidden="true" size={16} />
          {t(`roles.${id}.label`)}
        </button>
      ))}
    </div>
  );
}
