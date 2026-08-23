import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import i18n from '@/app/i18n';
import { usePreferences, type Locale, type Role } from '@/features/preferences/store';
import { BobProvider } from '@/features/bob/BobProvider';
import { ProjectPage } from '@/pages/ProjectPage';

// jsdom does not implement scrollTo/scrollIntoView. Mock both entry points so
// the hash and clean-URL branches remain deterministic.
let scrollIntoViewMock: ReturnType<typeof vi.fn>;
let scrollToMock: ReturnType<typeof vi.fn>;

beforeEach(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: true,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }),
  });
  scrollIntoViewMock = vi.fn();
  Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
    configurable: true,
    writable: true,
    value: scrollIntoViewMock,
  });
  scrollToMock = vi.fn();
  Object.defineProperty(window, 'scrollTo', {
    configurable: true,
    writable: true,
    value: scrollToMock,
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
});

async function renderProject(entry: string, locale: Locale = 'en', role: Role = 'ai') {
  usePreferences.setState({ locale, role });
  await i18n.changeLanguage(locale);
  return render(
    <QueryClientProvider
      client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}
    >
      <MemoryRouter initialEntries={[entry]}>
        <BobProvider>
          <Routes>
            <Route path="/projects/:slug" element={<ProjectPage />} />
          </Routes>
        </BobProvider>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe('ProjectPage scroll on open', () => {
  it('scrolls the summary into view for a #case-summary card link', async () => {
    await renderProject('/projects/bitrix24-integrations#case-summary');

    expect(scrollIntoViewMock).toHaveBeenCalledTimes(1);
    expect(scrollIntoViewMock).toHaveBeenCalledWith({
      behavior: 'auto',
      block: 'start',
    });
    expect(scrollToMock).not.toHaveBeenCalled();
    expect(document.getElementById('case-summary')).not.toBeNull();
  });

  it('opens a clean project URL from the top without scrolling to the summary', async () => {
    await renderProject('/projects/bitrix24-integrations');

    expect(scrollToMock).toHaveBeenCalledTimes(1);
    expect(scrollToMock).toHaveBeenCalledWith({ top: 0, behavior: 'auto' });
    expect(scrollIntoViewMock).not.toHaveBeenCalled();
  });

  it('keeps Task / Result as the final section, labelled with the locale title', async () => {
    const { container } = await renderProject('/projects/bitrix24-integrations');
    const article = container.querySelector('.case-detail');
    const summary = container.querySelector('.case-summary-grid');
    const sections = Array.from(article!.querySelectorAll('section'));

    // Presentations, evidence, and architecture stay above; the summary is last.
    expect(sections.length).toBeGreaterThanOrEqual(2);
    expect(sections[sections.length - 1]).toBe(summary);
    expect(summary).toHaveAttribute('id', 'case-summary');
    expect(summary).toHaveAttribute('aria-label', 'Task / Result');
    const labels = Array.from(summary!.querySelectorAll('.card-eyebrow')).map(
      (el) => el.textContent,
    );
    expect(labels).toEqual(['Task', 'Outcome']);
  });

  it('localizes the summary aria-label in Russian', async () => {
    const { container } = await renderProject('/projects/bitrix24-integrations', 'ru');

    expect(container.querySelector('.case-summary-grid')).toHaveAttribute(
      'aria-label',
      'Задача / Результат',
    );
  });
});
