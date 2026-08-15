import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import i18n from '@/app/i18n';
import { usePreferences, type Locale, type Role } from '@/features/preferences/store';
import { HomePage } from '@/pages/HomePage';

// Force reduced motion so animejs/framer-motion do not run in jsdom.
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
});

async function renderHome(locale: Locale, role: Role) {
  usePreferences.setState({ locale, role });
  await i18n.changeLanguage(locale);
  const view = render(
    <MemoryRouter initialEntries={['/']}>
      <HomePage />
    </MemoryRouter>,
  );
  return view;
}

function cardCopy(card: HTMLElement) {
  return card.querySelector('.featured-case-copy') as HTMLElement;
}

function cardVisual(card: HTMLElement) {
  return card.querySelector('.featured-visual') as HTMLElement;
}

function isBefore(first: Element, second: Element) {
  return (first.compareDocumentPosition(second) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0;
}

const bitrixLinkName = /Industrial Bitrix24 integrations/i;
const localLinkName = /Local AI Assistant/i;

describe('HomePage featured cases', () => {
  it('keeps the Bitrix24 card as the untouched copy→visual featured case', async () => {
    const { container } = await renderHome('en', 'ai');

    const bitrix = screen.getByRole('link', { name: bitrixLinkName });
    expect(bitrix).toHaveAttribute('href', '/projects/bitrix24-integrations');
    expect(bitrix).toHaveClass('featured-case', 'glass-panel');
    expect(bitrix).not.toHaveClass('featured-case--reverse');

    // DOM order must remain copy → visual (unchanged contract).
    expect(isBefore(cardCopy(bitrix), cardVisual(bitrix))).toBe(true);

    const copy = cardCopy(bitrix);
    expect(within(copy).getByText('001 / production')).toBeInTheDocument();
    expect(
      Array.from(copy.querySelectorAll('.tag-row span')).map((el) => el.textContent),
    ).toEqual(['Vue 3', 'TypeScript', 'Vite', 'Tailwind CSS', 'Bitrix24 UI']);
    expect(
      within(cardVisual(bitrix)).getByText('Watch presentation · 3 demos'),
    ).toBeInTheDocument();

    // Regression: Bento Grid still present with its own numbering.
    const bento = container.querySelector('.portfolio-bento') as HTMLElement;
    expect(bento).not.toBeNull();
    expect(
      within(bento.querySelector('.bento-project') as HTMLElement).getByText((content) =>
        content.startsWith('003'),
      ),
    ).toBeInTheDocument();
  });

  it('mirrors Local AI Assistant as visual→copy with reverse modifier', async () => {
    const { container } = await renderHome('en', 'ai');

    const local = screen.getByRole('link', { name: localLinkName });
    expect(local).toHaveAttribute('href', '/projects/local-ai-assistant');
    expect(local).toHaveClass('featured-case', 'featured-case--reverse', 'glass-panel');

    // Mirrored DOM order: visual before copy.
    expect(isBefore(cardVisual(local), cardCopy(local))).toBe(true);

    const visual = cardVisual(local);
    const img = visual.querySelector('img');
    expect(img).toHaveAttribute('src', '/media/local-ai-assistant-poster.webp');
    expect(img).toHaveAttribute('alt', 'Local AI Assistant extension interface');
    expect(within(visual).getByText('Watch presentation · 1 demo')).toBeInTheDocument();

    const copy = cardCopy(local);
    expect(within(copy).getByText('002 / active')).toBeInTheDocument();
    expect(
      within(copy).getByText('Chrome Extension · contextual AI agent'),
    ).toBeInTheDocument();
    expect(within(copy).getByText('Local AI Assistant')).toBeInTheDocument();
    expect(
      within(copy).getByText((content) =>
        content.startsWith('Designed the complete agent loop'),
      ),
    ).toBeInTheDocument();
    expect(
      Array.from(copy.querySelectorAll('.tag-row span')).map((el) => el.textContent),
    ).toEqual(['Chrome MV3', 'React 19', 'TypeScript', 'FastAPI', 'LangGraph']);

    // Local is a standalone second featured card, never inside the Bento Grid.
    const bento = container.querySelector('.portfolio-bento') as HTMLElement;
    expect(within(bento).queryByText('Local AI Assistant')).toBeNull();
    expect(within(bento).queryByRole('link', { name: localLinkName })).toBeNull();
    expect(screen.getAllByRole('link', { name: localLinkName })).toHaveLength(1);
  });

  it('hides the Local card and keeps numbering 002 in the Frontend lens', async () => {
    const { container } = await renderHome('en', 'frontend');

    expect(screen.queryByRole('link', { name: localLinkName })).toBeNull();

    // Bitrix24 remains the sole featured card.
    const bitrix = screen.getByRole('link', { name: bitrixLinkName });
    expect(isBefore(cardCopy(bitrix), cardVisual(bitrix))).toBe(true);

    // With one featured card, the Bento Grid resumes at 002.
    const bento = container.querySelector('.portfolio-bento') as HTMLElement;
    expect(
      within(bento.querySelector('.bento-project') as HTMLElement).getByText((content) =>
        content.startsWith('002'),
      ),
    ).toBeInTheDocument();
    expect(within(bento).queryByText('Local AI Assistant')).toBeNull();
  });

  it('localizes the mirrored Local card in Russian', async () => {
    const { container } = await renderHome('ru', 'ai');

    const local = screen.getByRole('link', { name: localLinkName });
    expect(isBefore(cardVisual(local), cardCopy(local))).toBe(true);

    const visual = cardVisual(local);
    expect(visual.querySelector('img')).toHaveAttribute(
      'alt',
      'Интерфейс расширения Local AI Assistant',
    );
    expect(within(visual).getByText('Смотреть презентацию · 1 demo')).toBeInTheDocument();

    const copy = cardCopy(local);
    expect(within(copy).getByText('002 / active')).toBeInTheDocument();
    expect(
      within(copy).getByText('Chrome Extension · контекстный AI-агент'),
    ).toBeInTheDocument();
    expect(
      within(copy).getByText((content) =>
        content.startsWith('Спроектировал полный агентный цикл'),
      ),
    ).toBeInTheDocument();

    const bento = container.querySelector('.portfolio-bento') as HTMLElement;
    expect(within(bento).queryByText('Local AI Assistant')).toBeNull();
    expect(screen.getAllByRole('link', { name: localLinkName })).toHaveLength(1);
  });
});
