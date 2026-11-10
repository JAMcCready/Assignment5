import fs from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { parse } from 'csv-parse/sync';
import { stringify } from 'csv-stringify/sync';

/**
 * Thrown when an entry fails validation.
 */
export class ValidationError extends Error {
  /**
   * @param {string[]} errors - Validation error messages.
   */
  constructor(errors) {
    super('Validation failed');
    this.name = 'ValidationError';
    this.errors = errors;
  }
}

/**
 * Stores money entries of one type in a CSV file.
 * Entries are loaded into memory on creation and the file is
 * rewritten after every change.
 */
export class Ledger {
  /**
   * Loads the entries from the file, creating the file if it does not exist.
   *
   * @param {string} file - Path to the CSV file.
   * @param {typeof import('./models/MoneyEntry.js').MoneyEntry} EntryClass -
   *   The MoneyEntry subclass stored in this ledger, e.g. Expense.
   */
  constructor(file, EntryClass) {
    this.file = file;
    this.EntryClass = EntryClass;
    this.columns = Object.keys(new EntryClass({}));

    if (!fs.existsSync(file)) {
      fs.mkdirSync(path.dirname(file), { recursive: true });
      this.entries = [];
      this.save();
    } else {
      const rows = parse(fs.readFileSync(file, 'utf8'), { columns: true });
      this.entries = rows.map((row) => new EntryClass({ ...row, amount: Number(row.amount) }));
    }
  }

  /**
   * @returns {MoneyEntry[]} All entries.
   */
  findAll() {
    return this.entries;
  }

  /**
   * @param {string} id
   * @returns {MoneyEntry | undefined} The entry, or undefined if not found.
   */
  findById(id) {
    return this.entries.find((entry) => entry.id === id);
  }

  /**
   * Validates the entry, assigns it a new id and saves it.
   *
   * @param {MoneyEntry} entry
   * @returns {MoneyEntry} The saved entry.
   * @throws {ValidationError} If the entry is invalid.
   */
  add(entry) {
    const errors = entry.validate();
    if (errors.length > 0) {
      throw new ValidationError(errors);
    }

    entry.id = randomUUID();
    this.entries.push(entry);
    this.save();
    return entry;
  }

  /**
   * Validates the entry and replaces the entry with the given id.
   *
   * @param {string} id
   * @param {MoneyEntry} entry
   * @returns {MoneyEntry | null} The updated entry, or null if not found.
   * @throws {ValidationError} If the entry is invalid.
   */
  update(id, entry) {
    const index = this.entries.findIndex((existing) => existing.id === id);
    if (index === -1) {
      return null;
    }

    const errors = entry.validate();
    if (errors.length > 0) {
      throw new ValidationError(errors);
    }

    entry.id = id;
    this.entries[index] = entry;
    this.save();
    return entry;
  }

  /**
   * Removes the entry with the given id.
   *
   * @param {string} id
   * @returns {boolean} True if an entry was removed, false if not found.
   */
  delete(id) {
    const index = this.entries.findIndex((entry) => entry.id === id);
    if (index === -1) {
      return false;
    }

    this.entries.splice(index, 1);
    this.save();
    return true;
  }

  /**
   * Writes all entries to the CSV file.
   */
  save() {
    const csv = stringify(this.entries, { header: true, columns: this.columns });
    fs.writeFileSync(this.file, csv);
  }
}