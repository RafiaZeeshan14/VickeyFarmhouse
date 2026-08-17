/** Normalize Pakistani numbers to E.164 without +, e.g. 923001234567 */
export function normalizePhone(raw: string | number): string {
  let p = String(raw).replace(/[^\d]/g, "");
  if (p.startsWith("0092")) p = p.slice(2);
  else if (p.startsWith("0")) p = "92" + p.slice(1);
  else if (!p.startsWith("92")) p = "92" + p;
  return p;
}

export const isValidPakistaniPhone = (p: string) => /^92\d{10}$/.test(p);
