export function roundToTwoDecimalPlaces(num: number): number {
  const sign = Math.sign(num) || 1;

  return (sign * Math.round((Math.abs(num) + Number.EPSILON) * 100)) / 100;
}
