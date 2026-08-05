import { roundToTwoDecimalPlaces } from './money';

describe('roundToTwoDecimalPlaces', () => {
  describe('basic rounding', () => {
    it('rounds down when the third decimal is below 5', () => {
      expect(roundToTwoDecimalPlaces(1.234)).toBe(1.23);
    });

    it('rounds up when the third decimal is 5 or above', () => {
      expect(roundToTwoDecimalPlaces(1.236)).toBe(1.24);
    });

    it('leaves values that are already 2 decimal places unchanged', () => {
      expect(roundToTwoDecimalPlaces(2.5)).toBe(2.5);
    });

    it('handles whole numbers', () => {
      expect(roundToTwoDecimalPlaces(2)).toBe(2);
    });

    it('handles zero', () => {
      expect(roundToTwoDecimalPlaces(0)).toBe(0);
    });

    it('normalizes negative zero to zero', () => {
      expect(Object.is(roundToTwoDecimalPlaces(-0), 0)).toBe(true);
    });
  });

  describe('floating-point precision edge cases', () => {
    // These are the cases that break naive Math.round(num * 100) / 100,
    // because num * 100 does not evaluate to an exact .5 boundary.
    it('correctly rounds 1.005 up to 1.01', () => {
      expect(roundToTwoDecimalPlaces(1.005)).toBe(1.01);
    });

    it('correctly rounds 0.005 up to 0.01', () => {
      expect(roundToTwoDecimalPlaces(0.005)).toBe(0.01);
    });

    it('correctly rounds 1.045 up to 1.05', () => {
      expect(roundToTwoDecimalPlaces(1.045)).toBe(1.05);
    });

    it('correctly rounds 0.615 up to 0.62', () => {
      expect(roundToTwoDecimalPlaces(0.615)).toBe(0.62);
    });

    it('correctly rounds a longer decimal (3.14159 -> 3.14)', () => {
      expect(roundToTwoDecimalPlaces(3.14159)).toBe(3.14);
    });
  });

  describe('negative numbers (round half away from zero)', () => {
    it('rounds -1.235 to -1.24, mirroring the positive case', () => {
      expect(roundToTwoDecimalPlaces(-1.235)).toBe(-1.24);
    });

    it('rounds -1.005 to -1.01, mirroring the positive case', () => {
      expect(roundToTwoDecimalPlaces(-1.005)).toBe(-1.01);
    });

    it('rounds -0.005 to -0.01, mirroring the positive case', () => {
      expect(roundToTwoDecimalPlaces(-0.005)).toBe(-0.01);
    });

    it('correctly rounds a longer negative decimal (-3.14159 -> -3.14)', () => {
      expect(roundToTwoDecimalPlaces(-3.14159)).toBe(-3.14);
    });
  });

  describe('magnitude and range', () => {
    it('handles large numbers without losing precision', () => {
      expect(roundToTwoDecimalPlaces(1234567.891)).toBe(1234567.89);
    });

    it('handles values that round up to a new whole number', () => {
      expect(roundToTwoDecimalPlaces(100.999)).toBe(101);
    });
  });

  describe('non-finite input', () => {
    it('returns NaN for NaN input', () => {
      expect(roundToTwoDecimalPlaces(NaN)).toBeNaN();
    });

    it('returns Infinity for Infinity input', () => {
      expect(roundToTwoDecimalPlaces(Infinity)).toBe(Infinity);
    });

    it('returns -Infinity for -Infinity input', () => {
      expect(roundToTwoDecimalPlaces(-Infinity)).toBe(-Infinity);
    });
  });
});
