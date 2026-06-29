export function normalizePhone(input: string): string {
  const digits = input.replace(/\D/g, '');
  const local = digits.startsWith('221') ? digits.slice(3) : digits;
  return `+221${local}`;
}
