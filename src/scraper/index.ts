import puppeteer, { type Browser, type Page } from 'puppeteer';
import { authenticateSheets } from '../googleSheets/auth';
// import { mockData } from './mockData';
import { getListingDataFromOneHome } from './oneHome';
import { appendDataToSheet } from '../googleSheets';
import { QUERY_STRING, spreadsheetId } from '../secrets';
import type WebSocket from 'ws';
import { STATUS_MESSAGES } from './constants';

export const runReScraper = async (ws: WebSocket): Promise<void> => {
  const sheets = await authenticateSheets();

  const browser: Browser = await puppeteer.launch({
    headless: 'new',
    defaultViewport: null,
  });

  const page: Page = await browser.newPage();
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36',
  );

  await page.goto(QUERY_STRING, {
    waitUntil: 'domcontentloaded',
  });
  const scrapedListingData = await getListingDataFromOneHome(page, ws);

  // Convert the listing data into a format that can be appended to the Google Sheet
  const dataToAppend: string[][] = scrapedListingData.map((item) => Object.values(item));

  try {
    console.log(STATUS_MESSAGES.STEP_6);
    ws.send(STATUS_MESSAGES.STEP_6);
    await appendDataToSheet(sheets, spreadsheetId, 'Sheet1!A2', dataToAppend);
    console.log(STATUS_MESSAGES.STEP_7);
    ws.send(STATUS_MESSAGES.STEP_7);
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error accessing or updating Google Sheet:', error);
      ws.send(`Error: ${error.message}`);
    } else {
      console.error('Unexpected error type accessing or updating Google Sheet:', error);
      ws.send(`Unexpected error type: ${typeof error}`);
    }
  } finally {
    await browser.close();
    console.log(STATUS_MESSAGES.STEP_8);
    ws.send(STATUS_MESSAGES.STEP_8);
    ws.close();
  }
};
