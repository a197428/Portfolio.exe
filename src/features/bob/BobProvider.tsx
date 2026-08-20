import { useMutation, useQuery } from '@tanstack/react-query';
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { Citation, ChatMode, ChatRequest } from '@/features/bob/contracts';
import { BobApiError, streamBob } from '@/features/bob/api';
import { bobPlainText } from '@/features/bob/plainText';
import { usePreferences } from '@/features/preferences/store';

export interface BobMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: Citation[];
}

interface BobContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  mode: ChatMode;
  setMode: (mode: ChatMode) => void;
  draft: string;
  setDraft: (draft: string) => void;
  messages: BobMessage[];
  error: BobApiError | null;
  streaming: boolean;
  needsChallenge: boolean;
  turnstileSiteKey: string | null;
  setTurnstileToken: (token: string) => void;
  send: (message?: string) => void;
  stop: () => void;
  retry: () => void;
  launcherRef: React.RefObject<HTMLButtonElement | null>;
}

const BobContext = createContext<BobContextValue | null>(null);

export function BobProvider({ children }: { children: ReactNode }) {
  const locale = usePreferences((state) => state.locale);
  const role = usePreferences((state) => state.role);
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<ChatMode>('qa');
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState<BobMessage[]>([]);
  const [error, setError] = useState<BobApiError | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string>();
  const [lastInput, setLastInput] = useState('');
  const controller = useRef<AbortController | undefined>(undefined);
  const launcherRef = useRef<HTMLButtonElement>(null);

  const config = useQuery({
    queryKey: ['bob-config'],
    queryFn: async () => {
      const response = await fetch('/api/bob/config');
      if (!response.ok) return { turnstileSiteKey: null };
      return (await response.json()) as { turnstileSiteKey: string | null };
    },
    staleTime: Number.POSITIVE_INFINITY,
  });

  const mutation = useMutation({
    mutationFn: async (input: string) => {
      controller.current = new AbortController();
      const assistantId = crypto.randomUUID();
      const history = messages.slice(-8).map(({ role: itemRole, content }) => ({
        role: itemRole,
        content: itemRole === 'assistant' ? bobPlainText(content) : content,
      }));
      setMessages((current) => [
        ...current,
        { id: crypto.randomUUID(), role: 'user', content: input },
        { id: assistantId, role: 'assistant', content: '' },
      ]);
      const request: ChatRequest = {
        mode,
        message: input,
        history,
        locale,
        role,
        turnstileToken,
      };
      await streamBob(request, controller.current.signal, (event) => {
        if (event.type === 'sources') {
          setMessages((current) =>
            current.map((item) =>
              item.id === assistantId ? { ...item, sources: event.sources } : item,
            ),
          );
        }
        if (event.type === 'delta') {
          setMessages((current) =>
            current.map((item) =>
              item.id === assistantId
                ? { ...item, content: item.content + event.text }
                : item,
            ),
          );
        }
        if (event.type === 'error') throw new BobApiError(event.code, event.message);
      });
      setTurnstileToken(undefined);
    },
    onError: (reason) => {
      if (reason instanceof DOMException && reason.name === 'AbortError') return;
      const apiError =
        reason instanceof BobApiError
          ? reason
          : new BobApiError('provider_unavailable', 'Bob is unavailable.');
      setError(apiError);
      setMessages((current) => {
        const last = current.at(-1);
        return last?.role === 'assistant' && !last.content
          ? current.slice(0, -1)
          : current;
      });
    },
  });

  const send = useCallback(
    (message = draft) => {
      const input = message.trim();
      if (!input || mutation.isPending) return;
      setError(null);
      setLastInput(input);
      setDraft('');
      mutation.mutate(input);
    },
    [draft, mutation],
  );

  const value = useMemo<BobContextValue>(
    () => ({
      open,
      setOpen,
      mode,
      setMode,
      draft,
      setDraft,
      messages,
      error,
      streaming: mutation.isPending,
      needsChallenge: error?.code === 'challenge_required',
      turnstileSiteKey: config.data?.turnstileSiteKey ?? null,
      setTurnstileToken,
      send,
      stop: () => controller.current?.abort(),
      retry: () => lastInput && send(lastInput),
      launcherRef,
    }),
    [
      open,
      mode,
      draft,
      messages,
      error,
      mutation.isPending,
      config.data?.turnstileSiteKey,
      lastInput,
      send,
    ],
  );

  return <BobContext.Provider value={value}>{children}</BobContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useBob() {
  const context = useContext(BobContext);
  if (!context) throw new Error('useBob must be used inside BobProvider');
  return context;
}
