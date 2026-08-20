import { ArrowUpRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { BobMark } from '@/features/bob/BobMark';
import { useBob } from '@/features/bob/BobProvider';

export function BobIntro() {
  const { t } = useTranslation();
  const { setDraft, setOpen, setMode } = useBob();
  const suggestions = t('bob.suggestions', { returnObjects: true }) as string[];
  const ask = (value: string) => {
    setMode('qa');
    setDraft(value);
    setOpen(true);
  };
  return (
    <div className="bob-intro glass-panel">
      <div className="bob-intro-head">
        <span className="bob-orbit">
          <BobMark size={34} />
        </span>
        <div>
          <strong>Боб</strong>
          <span>{t('bob.status')}</span>
        </div>
      </div>
      <div className="bob-suggestions">
        {suggestions.map((suggestion) => (
          <button type="button" key={suggestion} onClick={() => ask(suggestion)}>
            {suggestion}
            <ArrowUpRight size={15} />
          </button>
        ))}
      </div>
      <button
        className="primary-action enabled bob-intro-action"
        type="button"
        onClick={() => {
          setMode('qa');
          setOpen(true);
        }}
      >
        {t('bob.start')}
        <ArrowUpRight size={17} />
      </button>
    </div>
  );
}
