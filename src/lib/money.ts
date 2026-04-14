/** SAR amount (e.g. 35.5) → halalas (Int) */
export function sarToHalalas(sar: number): number {
  return Math.round(sar * 100);
}

/** Halalas → SAR for display */
export function halalasToSar(halalas: number): number {
  return halalas / 100;
}

export function formatSarFromHalalas(halalas: number): string {
  return new Intl.NumberFormat('en-SA', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(halalasToSar(halalas));
}
