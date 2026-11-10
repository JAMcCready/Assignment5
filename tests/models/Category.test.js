import { describe, it, expect } from 'vitest';
import { CATEGORIES } from '../../src/models/Category.js';

describe('Category', () => {
  it('lists basic and extra as the valid categories', () => {
    expect(CATEGORIES).toEqual(['basic', 'extra']);
  });
});