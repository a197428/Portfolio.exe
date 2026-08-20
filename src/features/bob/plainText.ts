/** Converts occasional provider Markdown into readable text for the chat UI. */
export function bobPlainText(value: string) {
  return value
    .replace(/```(?:[\w-]+)?\n?([\s\S]*?)```/g, '$1')
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/^[ \t]{0,3}#{1,6}[ \t]+/gm, '')
    .replace(/^[ \t]{0,3}>[ \t]?/gm, '')
    .replace(/^[ \t]*[-*+][ \t]+/gm, '• ')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/(?<!\w)[*_]([^\n*_]+)[*_](?!\w)/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/~~([^~]+)~~/g, '$1')
    .replace(/[ \t]+\[\d+(?:\s*,\s*\d+)*\](?=[\s.,;:!?]|$)/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trimStart();
}
