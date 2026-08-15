/** Adapted from Kokonut UI AI Prompt, MIT. */
import { ArrowRight, Sparkles } from 'lucide-react';

export default function AIPrompt({
  title,
  placeholder,
}: {
  title: string;
  placeholder: string;
}) {
  return (
    <div className="ai-prompt-preview" aria-label={title}>
      <div className="ai-prompt-head">
        <Sparkles size={15} />
        <span>{title}</span>
        <span>soon</span>
      </div>
      <div className="ai-prompt-field">
        <textarea aria-label={placeholder} placeholder={placeholder} disabled rows={3} />
        <button type="button" aria-label="AI chat is coming soon" disabled>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
