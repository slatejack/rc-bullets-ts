import { isPlainObject, getCorrectTextColor, getRGB } from '../src/utils/utils';

describe('utils', () => {
  describe('isPlainObject', () => {
    it('returns true for plain objects', () => {
      expect(isPlainObject({ msg: 'hi' })).toBe(true);
    });

    it('returns true for functions (implementation treats functions as objects)', () => {
      expect(isPlainObject(() => null)).toBe(true);
    });

    it('returns false for string and number', () => {
      expect(isPlainObject('str')).toBe(false);
      expect(isPlainObject(1)).toBe(false);
    });

    it('returns true for null because typeof null === "object" (current implementation)', () => {
      expect(isPlainObject(null)).toBe(true);
    });

    it('returns false for undefined', () => {
      expect(isPlainObject(undefined)).toBe(false);
    });
  });

  describe('getRGB', () => {
    it('parses rgb() strings', () => {
      expect(getRGB('rgb(10, 20, 30)')).toEqual([10, 20, 30]);
    });

    it('falls back to black for invalid input', () => {
      expect(getRGB('not-a-color')).toEqual([0, 0, 0]);
    });
  });

  describe('getCorrectTextColor', () => {
    it('returns dark text for light hex backgrounds', () => {
      expect(getCorrectTextColor('#ffffff')).toBe('#50616d');
    });

    it('returns light text for dark hex backgrounds', () => {
      expect(getCorrectTextColor('#000000')).toBe('#e9f1f6');
    });

    it('accepts rgb number arrays', () => {
      expect(getCorrectTextColor([255, 255, 255])).toBe('#50616d');
      expect(getCorrectTextColor([0, 0, 0])).toBe('#e9f1f6');
    });

    it('parses rgb() string backgrounds', () => {
      expect(getCorrectTextColor('rgb(255, 255, 255)')).toBe('#50616d');
    });
  });
});
