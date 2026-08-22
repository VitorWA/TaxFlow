export function normalizeCnpj(value = "") {
  return value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 14);
}

export function formatCnpj(value = "") {
  const normalized = normalizeCnpj(value);
  const parts = [
    normalized.slice(0, 2),
    normalized.slice(2, 5),
    normalized.slice(5, 8),
    normalized.slice(8, 12),
    normalized.slice(12, 14),
  ];

  let formatted = parts[0];
  if (parts[1]) formatted += `.${parts[1]}`;
  if (parts[2]) formatted += `.${parts[2]}`;
  if (parts[3]) formatted += `/${parts[3]}`;
  if (parts[4]) formatted += `-${parts[4]}`;
  return formatted;
}

function calculateDigit(base) {
  let weight = base.length - 7;
  const sum = [...base].reduce((total, character) => {
    const next = total + (character.charCodeAt(0) - 48) * weight;
    weight -= 1;
    if (weight === 1) weight = 9;
    return next;
  }, 0);
  const remainder = sum % 11;
  return remainder < 2 ? 0 : 11 - remainder;
}

export function isValidCnpj(value) {
  const normalized = normalizeCnpj(value);
  if (!/^[A-Z0-9]{12}[0-9]{2}$/.test(normalized)) return false;

  const base = normalized.slice(0, 12);
  if (new Set(base).size === 1) return false;

  const firstDigit = calculateDigit(base);
  const secondDigit = calculateDigit(`${base}${firstDigit}`);
  return normalized.endsWith(`${firstDigit}${secondDigit}`);
}

export function handleCnpjInput(event) {
  event.currentTarget.value = formatCnpj(event.currentTarget.value);
}
