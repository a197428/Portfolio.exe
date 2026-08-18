import { MessageCircleMore } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useBob } from '@/features/bob/BobProvider';

export function BobLauncher() {
  const { t } = useTranslation();
  const { setOpen, launcherRef } = useBob();
  return (
    <button
      className="bob-launcher"
      type="button"
      ref={launcherRef}
      onClick={() => setOpen(true)}
      aria-label={t('bob.open')}
    >
      <span className="bob-launcher-pulse" aria-hidden="true" />
      <MessageCircleMore size={20} />
      <span>Боб</span>
    </button>
  );
}
