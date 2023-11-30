import { google } from 'googleapis';
import { GoogleAuth } from 'google-auth-library';
import { type Sheets } from '../types';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';

export const authenticateSheets = async (): Promise<Sheets> => {
  const fileName = fileURLToPath(import.meta.url);
  const dirName = dirname(fileName);
  const keyFilePath = path.join(dirName, '../../rescraper-key.json');
  const auth = new GoogleAuth({
    keyFile: keyFilePath,
    scopes: 'https://www.googleapis.com/auth/spreadsheets',
  });
  return google.sheets({ version: 'v4', auth });
};
