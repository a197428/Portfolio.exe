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
const shortSportLinkName = /ShortSport AI Forge/i;
const videoTranscriberLinkName = /Video Transcriber/i;
const neurosportTmaLinkName = /Neurosport TMA/i;
const readCloseBotLinkName = /Read-Close-Bot/i;
const todoLinkName = /Todo App/i;
const neurosportLinkName = /006 \/ mvp/;
const neuralGridLinkName = /007 \/ active/;
const energoAiLinkName = /008 \/ active/;

describe('HomePage featured cases', () => {
  it('renders the editorial portrait hero with accessible role-specific copy', async () => {
    const { container } = await renderHome('en', 'ai');

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Alexander Popoff',
    );
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'Interfaces that make intelligence tangible.',
      }),
    ).toBeInTheDocument();
    expect(screen.getByAltText('Portrait of Alexander Popoff')).toHaveAttribute(
      'src',
      '/image/Аватар_1.png',
    );
    expect(container.querySelector('.signal-card')).toBeNull();
    expect(container.querySelector('[data-hero-portrait]')).not.toHaveClass('avatar');
  });

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
    expect(cardVisual(bitrix).querySelector('img')).toHaveAttribute(
      'src',
      '/image/preview/Industrial Bitrix24 integrations.png',
    );

    // Every AI case is now a featured card, so the Bento Grid has no remaining projects.
    expect(container.querySelector('.portfolio-bento')).toBeNull();
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
    expect(img).toHaveAttribute('src', '/image/preview/Local AI Assistant.png');
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

    // Local is a standalone featured card; the Bento Grid has no remaining projects.
    expect(container.querySelector('.portfolio-bento')).toBeNull();
    expect(screen.getAllByRole('link', { name: localLinkName })).toHaveLength(1);
  });

  it('adds ShortSport as the third featured card in AI lens', async () => {
    const { container } = await renderHome('en', 'ai');

    const shortSport = screen.getByRole('link', { name: shortSportLinkName });
    expect(shortSport).toHaveAttribute('href', '/projects/shortsport-ai-forge');
    expect(shortSport).toHaveClass('featured-case', 'glass-panel');
    expect(shortSport).not.toHaveClass('featured-case--reverse');

    // DOM order: copy → visual (same as Bitrix24).
    expect(isBefore(cardCopy(shortSport), cardVisual(shortSport))).toBe(true);

    const copy = cardCopy(shortSport);
    expect(within(copy).getByText('003 / mvp')).toBeInTheDocument();
    expect(
      within(copy).getByText('Vue SPA · human-in-the-loop video workflow'),
    ).toBeInTheDocument();
    expect(
      within(copy).getByText((content) => content.startsWith('Designed a verifiable')),
    ).toBeInTheDocument();
    expect(
      Array.from(copy.querySelectorAll('.tag-row span')).map((el) => el.textContent),
    ).toEqual(['Vue 3', 'TypeScript', 'Pinia', 'Zod', 'Tailwind CSS']);

    const visual = cardVisual(shortSport);
    expect(visual.querySelector('img')).toHaveAttribute(
      'src',
      '/image/preview/ShortSport AI Forge.png',
    );
    expect(visual.querySelector('img')).toHaveAttribute(
      'alt',
      'ShortSport AI Forge storyboard editor interface',
    );
    expect(within(visual).getByText('Live demo')).toBeInTheDocument();

    // ShortSport is a featured card; the Bento Grid has no remaining projects.
    expect(container.querySelector('.portfolio-bento')).toBeNull();
  });

  it('adds Video Transcriber as the mirrored fourth featured card in AI lens', async () => {
    const { container } = await renderHome('en', 'ai');
    const project = screen.getByRole('link', { name: videoTranscriberLinkName });

    expect(project).toHaveAttribute('href', '/projects/video-sut');
    expect(project).toHaveClass('featured-case', 'featured-case--reverse', 'glass-panel');
    expect(isBefore(cardVisual(project), cardCopy(project))).toBe(true);

    const visual = cardVisual(project);
    expect(visual.querySelector('img')).toHaveAttribute(
      'src',
      '/image/preview/Video Transcriber.png',
    );
    expect(visual.querySelector('img')).toHaveAttribute(
      'alt',
      'Video Transcriber results dashboard interface',
    );
    expect(within(visual).getByText('Watch presentation · 1 demo')).toBeInTheDocument();

    const copy = cardCopy(project);
    expect(within(copy).getByText('004 / mvp')).toBeInTheDocument();
    expect(within(copy).getByText('Video Transcriber')).toBeInTheDocument();
    expect(container.querySelector('.portfolio-bento')).toBeNull();
  });

  it('adds Neurosport TMA as an independent fifth featured card in both lenses', async () => {
    const { container, rerender } = await renderHome('en', 'ai');
    const project = screen.getByRole('link', { name: neurosportTmaLinkName });

    expect(project).toHaveAttribute('href', '/projects/neurosport-tma');
    expect(project).toHaveClass('featured-case', 'glass-panel');
    expect(project).not.toHaveClass('featured-case--reverse');
    expect(isBefore(cardCopy(project), cardVisual(project))).toBe(true);
    expect(within(cardCopy(project)).getByText('005 / mvp')).toBeInTheDocument();
    expect(cardVisual(project).querySelector('img')).toHaveAttribute(
      'src',
      '/image/preview/Neurosport TMA.png',
    );
    expect(cardVisual(project).querySelector('img')).toHaveAttribute(
      'alt',
      'Neurosport Telegram Mini App prediction interface',
    );
    expect(container.querySelector('.portfolio-bento')).toBeNull();

    usePreferences.setState({ locale: 'en', role: 'frontend' });
    rerender(
      <MemoryRouter initialEntries={['/']}>
        <HomePage />
      </MemoryRouter>,
    );
    expect(screen.getByRole('link', { name: neurosportTmaLinkName })).toBeInTheDocument();
  });

  it('adds Read-Close-Bot as the mirrored sixth card only in the AI lens', async () => {
    const { container, unmount } = await renderHome('en', 'ai');
    const project = screen.getByRole('link', { name: readCloseBotLinkName });

    expect(project).toHaveAttribute('href', '/projects/read-close-bot');
    expect(project).toHaveClass('featured-case', 'featured-case--reverse', 'glass-panel');
    expect(isBefore(cardVisual(project), cardCopy(project))).toBe(true);
    expect(within(cardCopy(project)).getByText('006 / active')).toBeInTheDocument();
    expect(cardVisual(project).querySelector('img')).toHaveAttribute(
      'src',
      '/image/preview/Read-Close-Bot.png',
    );
    expect(cardVisual(project).querySelector('img')).toHaveAttribute(
      'alt',
      'Read-Close-Bot AI agent architecture',
    );
    expect(
      within(cardVisual(project)).getByText('Agent architecture'),
    ).toBeInTheDocument();
    expect(container.querySelector('.portfolio-bento')).toBeNull();

    // Todo App stays frontend-only and never appears in the AI lens.
    expect(screen.queryByRole('link', { name: todoLinkName })).toBeNull();

    unmount();
    await renderHome('en', 'frontend');
    expect(screen.queryByRole('link', { name: readCloseBotLinkName })).toBeNull();
  });

  it('orders all eight featured cases 001→008 in the Frontend lens with mirrored geometry', async () => {
    const { container } = await renderHome('en', 'frontend');

    expect(screen.queryByRole('link', { name: localLinkName })).toBeNull();
    expect(screen.queryByRole('link', { name: readCloseBotLinkName })).toBeNull();

    const bitrix = screen.getByRole('link', { name: bitrixLinkName });
    expect(isBefore(cardCopy(bitrix), cardVisual(bitrix))).toBe(true);
    expect(within(cardCopy(bitrix)).getByText('001 / production')).toBeInTheDocument();

    const videoTranscriber = screen.getByRole('link', {
      name: videoTranscriberLinkName,
    });
    expect(within(cardCopy(videoTranscriber)).getByText('002 / mvp')).toBeInTheDocument();
    expect(isBefore(cardVisual(videoTranscriber), cardCopy(videoTranscriber))).toBe(true);

    const shortSport = screen.getByRole('link', { name: shortSportLinkName });
    expect(within(cardCopy(shortSport)).getByText('003 / mvp')).toBeInTheDocument();
    expect(isBefore(cardCopy(shortSport), cardVisual(shortSport))).toBe(true);

    const todo = screen.getByRole('link', { name: todoLinkName });
    expect(within(cardCopy(todo)).getByText('004 / active')).toBeInTheDocument();
    expect(isBefore(cardVisual(todo), cardCopy(todo))).toBe(true);

    const neurosportTma = screen.getByRole('link', { name: neurosportTmaLinkName });
    expect(within(cardCopy(neurosportTma)).getByText('005 / mvp')).toBeInTheDocument();
    expect(isBefore(cardCopy(neurosportTma), cardVisual(neurosportTma))).toBe(true);

    const neurosport = screen.getByRole('link', { name: neurosportLinkName });
    expect(within(cardCopy(neurosport)).getByText('006 / mvp')).toBeInTheDocument();
    expect(isBefore(cardVisual(neurosport), cardCopy(neurosport))).toBe(true);

    const neuralGrid = screen.getByRole('link', { name: neuralGridLinkName });
    expect(within(cardCopy(neuralGrid)).getByText('007 / active')).toBeInTheDocument();
    expect(isBefore(cardCopy(neuralGrid), cardVisual(neuralGrid))).toBe(true);

    const energoAi = screen.getByRole('link', { name: energoAiLinkName });
    expect(within(cardCopy(energoAi)).getByText('008 / active')).toBeInTheDocument();
    expect(isBefore(cardVisual(energoAi), cardCopy(energoAi))).toBe(true);

    // Full vertical chain 001→008 in DOM order.
    expect(isBefore(bitrix, videoTranscriber)).toBe(true);
    expect(isBefore(videoTranscriber, shortSport)).toBe(true);
    expect(isBefore(shortSport, todo)).toBe(true);
    expect(isBefore(todo, neurosportTma)).toBe(true);
    expect(isBefore(neurosportTma, neurosport)).toBe(true);
    expect(isBefore(neurosport, neuralGrid)).toBe(true);
    expect(isBefore(neuralGrid, energoAi)).toBe(true);

    // The three site projects use their poster covers and the Live demo label.
    const neurosportImg = cardVisual(neurosport).querySelector('img');
    expect(neurosportImg).toHaveAttribute('src', '/media/neurosport.webp');
    expect(neurosportImg).toHaveAttribute(
      'alt',
      'Neurosport new sport prediction platform',
    );
    expect(within(cardVisual(neurosport)).getByText('Live demo')).toBeInTheDocument();

    const neuralGridImg = cardVisual(neuralGrid).querySelector('img');
    expect(neuralGridImg).toHaveAttribute('src', '/media/neuralgrid-international.webp');
    expect(neuralGridImg).toHaveAttribute(
      'alt',
      'NeuralGrid International technology landing',
    );
    expect(within(cardVisual(neuralGrid)).getByText('Live demo')).toBeInTheDocument();

    const energoAiImg = cardVisual(energoAi).querySelector('img');
    expect(energoAiImg).toHaveAttribute('src', '/media/energo-ai.webp');
    expect(energoAiImg).toHaveAttribute(
      'alt',
      'EnergoAI energy intelligence product site',
    );
    expect(within(cardVisual(energoAi)).getByText('Live demo')).toBeInTheDocument();

    // With every project featured, the Bento Grid has no remaining projects.
    expect(container.querySelector('.portfolio-bento')).toBeNull();
  });

  it('adds Todo App as the mirrored fourth featured card in the Frontend lens', async () => {
    const { container } = await renderHome('en', 'frontend');

    const todo = screen.getByRole('link', { name: todoLinkName });
    expect(todo).toHaveAttribute('href', '/projects/todo-app');
    expect(todo).toHaveClass('featured-case', 'featured-case--reverse', 'glass-panel');
    expect(isBefore(cardVisual(todo), cardCopy(todo))).toBe(true);

    const visual = cardVisual(todo);
    const img = visual.querySelector('img');
    expect(img).toHaveAttribute('src', '/image/preview/Todo App.png');
    expect(img).toHaveAttribute('alt', 'Todo App task list interface');
    expect(within(visual).getByText('Watch presentation · 1 demo')).toBeInTheDocument();

    const copy = cardCopy(todo);
    expect(within(copy).getByText('004 / active')).toBeInTheDocument();
    expect(
      within(copy).getByText(
        'Nuxt/Vue composables, role-aware UX, CRUD, filters, pagination, unit and e2e tests.',
      ),
    ).toBeInTheDocument();
    expect(
      Array.from(copy.querySelectorAll('.tag-row span')).map((el) => el.textContent),
    ).toEqual(['Nuxt 3', 'Vue 3', 'TypeScript', 'Tailwind CSS', 'Axios']);

    // Todo App is a featured card; the Bento Grid has no remaining projects.
    expect(container.querySelector('.portfolio-bento')).toBeNull();
  });

  it('localizes the Todo App poster alt and watch label in Russian', async () => {
    await renderHome('ru', 'frontend');

    const todo = screen.getByRole('link', { name: todoLinkName });
    const img = cardVisual(todo).querySelector('img');
    expect(img).toHaveAttribute('alt', 'Интерфейс списка задач Todo App');
    expect(
      within(cardVisual(todo)).getByText('Смотреть презентацию · 1 demo'),
    ).toBeInTheDocument();
  });

  it('localizes the Neurosport card poster alt in Russian', async () => {
    await renderHome('ru', 'frontend');

    const neurosport = screen.getByRole('link', { name: neurosportLinkName });
    expect(within(cardCopy(neurosport)).getByText('006 / mvp')).toBeInTheDocument();
    expect(cardVisual(neurosport).querySelector('img')).toHaveAttribute(
      'alt',
      'Платформа прогнозов нового вида спорта Neurosport',
    );
    expect(within(cardVisual(neurosport)).getByText('Live demo')).toBeInTheDocument();
  });

  it('localizes ShortSport in Russian', async () => {
    await renderHome('ru', 'ai');

    const shortSport = screen.getByRole('link', { name: shortSportLinkName });
    const visual = cardVisual(shortSport);
    expect(visual.querySelector('img')).toHaveAttribute(
      'alt',
      'Интерфейс редактора сторибордов ShortSport AI Forge',
    );
    expect(within(visual).getByText('Live demo')).toBeInTheDocument();

    const copy = cardCopy(shortSport);
    expect(within(copy).getByText('003 / mvp')).toBeInTheDocument();
    expect(
      within(copy).getByText('Vue SPA · human-in-the-loop video workflow'),
    ).toBeInTheDocument();
    expect(
      within(copy).getByText((content) =>
        content.startsWith('Спроектировал проверяемый'),
      ),
    ).toBeInTheDocument();
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

    expect(container.querySelector('.portfolio-bento')).toBeNull();
    expect(screen.getAllByRole('link', { name: localLinkName })).toHaveLength(1);
  });

  it('localizes the Video Transcriber presentation action in Russian', async () => {
    await renderHome('ru', 'ai');
    const project = screen.getByRole('link', { name: videoTranscriberLinkName });

    expect(
      within(cardVisual(project)).getByText('Смотреть презентацию · 1 demo'),
    ).toBeInTheDocument();
    expect(cardVisual(project).querySelector('img')).toHaveAttribute(
      'alt',
      'Интерфейс дашборда результатов Video Transcriber',
    );
  });
});
