import puppeteer, { type Browser, type Page } from 'puppeteer';
import { authenticateSheets } from '../googleSheets/auth';
// import { mockData } from './mockData';
import { getListingDataFromOneHome } from './oneHome';
import { appendDataToSheet } from '../googleSheets';
import { QUERY_STRING, spreadsheetId } from '../secrets';

export const runReScraper = async (): Promise<void> => {
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
  const scrapedListingData = await getListingDataFromOneHome(page);

  // Convert the listing data into a format that can be appended to the Google Sheet
  const dataToAppend: string[][] = scrapedListingData.map((item) => Object.values(item));

  try {
    console.log('6. Updating google sheet');
    await appendDataToSheet(sheets, spreadsheetId, 'Sheet1!A2', dataToAppend);
    console.log('7. Google sheet updated with data successfully.');
  } catch (error) {
    console.error('Error accessing or updating Google Sheet:', error);
  }
  await browser.close();
};
