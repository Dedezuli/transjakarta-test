import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

export interface WebTableUser {
  firstName: string;
  lastName: string;
  email: string;
  age: string;
  salary: string;
  department: string;
}

export function readCsv<T>(fileName: string): T[] {
  const filePath = path.resolve(__dirname, fileName);
  const content = fs.readFileSync(filePath, 'utf-8');
  return parse(content, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  }) as T[];
}

export const readUsers = (): WebTableUser[] => readCsv<WebTableUser>('users.csv');
