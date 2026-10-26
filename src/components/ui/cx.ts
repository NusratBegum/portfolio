/** Join class names, skipping falsy entries. */
export const cx = (...c: Array<string | false | null | undefined>) => c.filter(Boolean).join(' ');
