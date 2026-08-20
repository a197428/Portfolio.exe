import { useTranslation } from 'react-i18next';
import { BobMark } from '@/features/bob/BobMark';
import { useBob } from '@/features/bob/BobProvider';

export function BobLauncher() {
  const { t } = useTranslation();
  const { setOpen, setMode, launcherRef } = useBob();
  return (
    <button
      className="bob-launcher"
      type="button"
      ref={launcherRef}
      onClick={() => {
        setMode('qa');
        setOpen(true);
      }}
      aria-label={t('bob.open')}
    >
      <BobMark size={25} className="bob-launcher-mark" />
      <span>Боб</span>
    </button>
  );
}
