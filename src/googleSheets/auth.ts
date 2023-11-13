import { google } from 'googleapis';
import { GoogleAuth } from 'google-auth-library';
import path from 'path';
import { type Sheets } from '../types';

export const authenticateSheets = async (): Promise<Sheets> => {
  const keyFilePath = path.join(__dirname, '../../rescraper-key.json');
  const auth = new GoogleAuth({
    keyFile: keyFilePath,
    scopes: 'https://www.googleapis.com/auth/spreadsheets',
  });
  return google.sheets({ version: 'v4', auth });
};
