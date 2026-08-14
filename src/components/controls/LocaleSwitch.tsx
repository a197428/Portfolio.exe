import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { usePreferences, type Locale } from '@/features/preferences/store';

const locales: Locale[] = ['ru', 'en'];

export function LocaleSwitch() {
  const { i18n, t } = useTranslation();
  const locale = usePreferences((state) => state.locale);
  const setLocale = usePreferences((state) => state.setLocale);

  useEffect(() => {
    void i18n.changeLanguage(locale);
    document.documentElement.setAttribute('lang', locale);
  }, [i18n, locale]);

  const select = (next: Locale) => {
    setLocale(next);
  };

  return (
    <div className="segmented compact" role="group" aria-label={t('controls.language')}>
      {locales.map((item) => (
        <button
          className="segment"
          data-active={locale === item}
          key={item}
          onClick={() => select(item)}
          type="button"
          aria-pressed={locale === item}
        >
          {item.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
