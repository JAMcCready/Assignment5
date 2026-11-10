import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Ledger, ValidationError } from '../../src/repositories/Ledger.js';
import { Expense } from '../../src/models/Expense.js';

describe('Ledger', () => {
  let dir;
  let file;
  let ledger;
  let groceries;

  // Each test gets its own empty folder and ledger; the folder is deleted afterwards.
  beforeEach(() => {
    dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ledger-test-'));
    file = path.join(dir, 'expenses.csv');
    ledger = new Ledger(file, Expense);
    groceries = new Expense({ description: 'Groceries', amount: 42.75, category: 'basic', date: '2026-11-10' });
  });

  afterEach(() => {
    fs.rmSync(dir, { recursive: true, force: true });
  });

  it('creates the file with a header row', () => {
    expect(fs.readFileSync(file, 'utf8')).toBe('id,amount,date,description,category\n');
  });

  it('adds an entry with a new id', () => {
    const saved = ledger.add(groceries);

    expect(saved.id).toBeTruthy();
    expect(ledger.findAll()).toHaveLength(1);
  });

  it('keeps saved entries after the file is opened again', () => {
    const saved = ledger.add(groceries);

    const reopened = new Ledger(file, Expense);

    expect(reopened.findById(saved.id).description).toBe('Groceries');
    expect(reopened.findById(saved.id).amount).toBe(42.75);
  });

  it('keeps commas in a description', () => {
    groceries.description = 'Dinner, with friends';
    const saved = ledger.add(groceries);

    const reopened = new Ledger(file, Expense);

    expect(reopened.findById(saved.id).description).toBe('Dinner, with friends');
  });

  it('throws a ValidationError for an invalid entry', () => {
    groceries.amount = 0;

    expect(() => ledger.add(groceries)).toThrow(ValidationError);
  });

  it('saves nothing when the entry is invalid', () => {
    groceries.amount = 0;

    expect(() => ledger.add(groceries)).toThrow();

    expect(ledger.findAll()).toEqual([]);
  });

  it('returns undefined when finding an id that does not exist', () => {
    expect(ledger.findById('missing')).toBeUndefined();
  });

  it('updates an entry and keeps its id', () => {
    const saved = ledger.add(groceries);

    ledger.update(saved.id, new Expense({ description: 'Rent', amount: 1200, category: 'basic', date: '2026-11-01' }));

    const reopened = new Ledger(file, Expense);
    expect(reopened.findAll()).toHaveLength(1);
    expect(reopened.findById(saved.id).description).toBe('Rent');
  });

  it('returns null when updating an id that does not exist', () => {
    expect(ledger.update('missing', groceries)).toBeNull();
  });

  it('deletes an entry', () => {
    const saved = ledger.add(groceries);

    expect(ledger.delete(saved.id)).toBe(true);

    const reopened = new Ledger(file, Expense);
    expect(reopened.findAll()).toEqual([]);
  });

  it('returns false when deleting an id that does not exist', () => {
    expect(ledger.delete('missing')).toBe(false);
  });
});