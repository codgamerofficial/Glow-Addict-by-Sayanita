export function formatINR(value: number | string | null | undefined) {
  const numericValue = typeof value === 'number' ? value : Number(value ?? 0);
  if (!Number.isFinite(numericValue)) {
    return '₹0';
  }

  return '₹' + numericValue.toLocaleString('en-IN');
}