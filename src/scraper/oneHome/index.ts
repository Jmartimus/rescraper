/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { type Page } from 'puppeteer';
import { type OneHomeListing } from '../../types';

export const getListingDataFromOneHome = async (page: Page): Promise<OneHomeListing[]> => {
  // 1. wait for close button
  const CLOSE_BUTTON_SELECTOR = '[data-test-id="close-button"]';
  await page.waitForSelector(CLOSE_BUTTON_SELECTOR);

  // 2. Click close button
  await page.evaluate(() => {
    const CLOSE_BUTTON_SELECTOR = '[data-test-id="close-button"]';
    const closeButton = document.querySelector(CLOSE_BUTTON_SELECTOR);
    if (closeButton instanceof HTMLElement) {
      closeButton.click();
    }
  });
  console.log('1. Closed intro modal');

  // 3. Wait for the map toggle
  const MAP_TOGGLE_SELECTOR = '[class="switch-wrapper"]';
  await page.waitForSelector(MAP_TOGGLE_SELECTOR);

  // 4. Click map toggle and click noThanks button if the modal pops.
  await page.evaluate(() => {
    const MAP_TOGGLE_SELECTOR = '[class="switch-wrapper"]';
    const toggleMap = document.querySelector(MAP_TOGGLE_SELECTOR);
    if (toggleMap instanceof HTMLElement) {
      toggleMap.click();
    }
  });
  console.log('2. Closed map screen');

  // 5. Close pesky feedback modal if it appears
  const maxWaitTime = 5000;
  const closeModal = async () => {
    const NO_THANKS_TOGGLE = '[aria-label="No thanks"]';
    try {
      // Wait for the modal to appear
      await page.waitForSelector(NO_THANKS_TOGGLE, { timeout: maxWaitTime });
      await page.click(NO_THANKS_TOGGLE);
    } catch (error) {
      console.error(error);
    }
  };
  await closeModal();
  console.log('3. Closed feedback modal');

  // 6. Wait for load more button and click multiple times
  const LOAD_MORE_SELECTOR = '[class="button small primary collapse"]';
  await page.waitForSelector(LOAD_MORE_SELECTOR);
  const clickCount = 5;
  for (let i = 0; i < clickCount; i++) {
    try {
      await page.waitForSelector(LOAD_MORE_SELECTOR, { timeout: maxWaitTime });
      await page.click(LOAD_MORE_SELECTOR);
    } catch (error) {
      break;
    }
  }
  console.log('4. Clicked load more button until it disappeared');

  const listingData: OneHomeListing[] = await page.evaluate(() => {
    console.log('5. Scraping data');
    // SELECTORS - need to be defined here within the browser context because they can't be pulled from the node context
    const LISTING_LIST_SELECTOR = '[class="property-content tile property"]';
    const LISTING_PRICE_SELECTOR = '[class="price"]';
    const LISTING_BEDS_SELECTOR = 'ul li:first-child';
    const LISTING_BATHS_SELECTOR = 'ul li:nth-child(2)';
    const LISTING_SQFT_SELECTOR = 'ul li:nth-child(3)';
    const LISTING_MLS_SELECTOR = '[class="mls"]';

    const listingList = document.querySelectorAll(LISTING_LIST_SELECTOR);
    return Array.from(listingList)
      .map((listing: Element) => {
        const price: string = listing.querySelector(LISTING_PRICE_SELECTOR)?.textContent ?? '';

        const adjustedPrice: string = (parseFloat(price.replace(/[$,]/g, '')) * 0.7).toLocaleString(
          'en-US',
          {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0,
          },
        );

        const beds: string = parseInt(
          listing.querySelector(LISTING_BEDS_SELECTOR)?.textContent ?? '',
          10,
        ).toString();

        const baths: string = parseInt(
          listing.querySelector(LISTING_BATHS_SELECTOR)?.textContent ?? '',
          10,
        ).toString();

        const sqft: string = parseInt(
          listing.querySelector(LISTING_SQFT_SELECTOR)?.textContent?.replace(/[^\d]/g, '') ?? '',
          10,
        ).toString();

        const address: string =
          listing.querySelector('address')?.textContent?.replace(/([a-z])([A-Z])/g, '$1 $2') ?? '';

        const mlsNum: string = (
          listing.querySelector(LISTING_MLS_SELECTOR)?.textContent ?? ''
        ).replace(/\D/g, '');

        const link: string =
          `https://agent.onehome.com${listing.querySelector('a')?.getAttribute('href')}` ?? '';

        return {
          price,
          adjustedPrice,
          beds,
          baths,
          sqft,
          address,
          mlsNum,
          link,
        };
      })
      .filter((listing): listing is OneHomeListing => !!listing); // Filter out undefined values
  });
  return listingData;
};
