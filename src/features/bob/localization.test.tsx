import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import i18n from '@/app/i18n';
import { usePreferences, type Locale, type Role } from '@/features/preferences/store';
import { BobProvider } from '@/features/bob/BobProvider';
import { BobLauncher } from '@/features/bob/BobLauncher';
import { BobIntro } from '@/features/bob/BobIntro';
import { BobDialog } from '@/features/bob/BobDialog';

// Drive the chat through the mocked stream instead of the network so a real
// assistant message lands in the store and its author label can be asserted.
vi.mock('@/features/bob/api', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/features/bob/api')>();
  return {
    ...actual,
    streamBob: vi.fn(async (_request, _signal, onEvent) => {
      onEvent({ type: 'delta', text: 'Evidence-backed answer.' });
      onEvent({ type: 'done', requestId: 'localization-test' });
    }),
  };
});

beforeEach(() => {
  // The dialog hides on Escape and the motion hooks read matchMedia; keep the
  // jsdom environment quiet and deterministic.
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
  vi.stubGlobal(
    'fetch',
    vi.fn(
      async () =>
        new Response(JSON.stringify({ turnstileSiteKey: null }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
    ),
  );
});

async function renderBob(locale: Locale) {
  usePreferences.setState({ locale, role: 'ai' as Role });
  await i18n.changeLanguage(locale);
  return render(
    <QueryClientProvider
      client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}
    >
      <BobProvider>
        <BobLauncher />
        <BobIntro />
        <BobDialog />
      </BobProvider>
    </QueryClientProvider>,
  );
}

describe('Bob name localization', () => {
  it('uses the localized name in the launcher, intro card, and dialog author', async () => {
    const { container } = await renderBob('en');

    const launcher = screen.getByRole('button', { name: 'Open chat with Bob' });
    expect(within(launcher).getByText('Bob')).toBeInTheDocument();
    expect(container.querySelector('.bob-intro-head strong')).toHaveTextContent('Bob');

    fireEvent.click(launcher);
    const dialog = screen.getByRole('dialog', { name: 'Bob — portfolio assistant' });
    fireEvent.change(within(dialog).getByPlaceholderText(/which projects demonstrate/i), {
      target: { value: 'Tell me about the agent pipeline' },
    });
    fireEvent.click(within(dialog).getByRole('button', { name: 'Send' }));

    await waitFor(() => {
      const author = dialog.querySelector('.bob-message.assistant .bob-message-author');
      expect(author).toHaveTextContent('Bob');
    });
  });

  it('uses the localized Russian name in the launcher, intro card, and dialog author', async () => {
    const { container } = await renderBob('ru');

    const launcher = screen.getByRole('button', { name: 'Открыть чат с Бобом' });
    expect(within(launcher).getByText('Боб')).toBeInTheDocument();
    expect(container.querySelector('.bob-intro-head strong')).toHaveTextContent('Боб');

    fireEvent.click(launcher);
    const dialog = screen.getByRole('dialog', { name: 'Боб — помощник по портфолио' });
    fireEvent.change(within(dialog).getByPlaceholderText(/какие проекты показывают/i), {
      target: { value: 'Расскажи про агентный пайплайн' },
    });
    fireEvent.click(within(dialog).getByRole('button', { name: 'Отправить' }));

    await waitFor(() => {
      const author = dialog.querySelector('.bob-message.assistant .bob-message-author');
      expect(author).toHaveTextContent('Боб');
    });
  });
});
