export const CONFESSION_LIMIT = 200;

export function validConfession(note: string) {
  const trimmed = note.trim();
  return trimmed.length > 0 && trimmed.length <= CONFESSION_LIMIT;
}