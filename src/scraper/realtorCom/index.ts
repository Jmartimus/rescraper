import { type Page } from 'puppeteer';
import { type RealtorComListing } from '../../types';

export const getListingDataFromRealtorCom = async (page: Page): Promise<RealtorComListing[]> => {
  const listingData: RealtorComListing[] = await page.evaluate(() => {
    // SELECTORS - need to be defined here within the browser context because they can't be pulled from the node context
    const LISTING_LIST_SELECTOR = '[data-testid="card-content"]' as const;
    const LISTING_PRICE_SELECTOR = '[data-testid="card-price"]' as const;
    const LISTING_BEDS_SELECTOR = '[data-testid="property-meta-beds"]' as const;
    const LISTING_BATHS_SELECTOR = '[data-testid="property-meta-baths"]' as const;
    const LISTING_SQFT_SELECTOR = '[data-testid="property-meta-sqft"]' as const;
    const LISTING_LOT_SELECTOR = '[data-testid="property-meta-lot-size"]' as const;
    const LISTING_ADD1_SELECTOR = '[data-testid="card-address-1"]' as const;
    const LISTING_ADD2_SELECTOR = '[data-testid="card-address-2"]' as const;

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
        const beds: string = (
          listing.querySelector(LISTING_BEDS_SELECTOR)?.textContent ?? ''
        ).replace(/^(\d[\d,.]*)[\s\S]*$/, '$1');
        const baths: string = (
          listing.querySelector(LISTING_BATHS_SELECTOR)?.textContent ?? ''
        ).replace(/^(\d[\d,.]*)[\s\S]*$/, '$1');
        const sqft: string = (
          listing.querySelector(LISTING_SQFT_SELECTOR)?.textContent ?? ''
        ).replace(/^(\d[\d,.]*)[\s\S]*$/, '$1');
        const lotSize: string = (
          listing.querySelector(LISTING_LOT_SELECTOR)?.textContent ?? ''
        ).replace(/^(\d[\d,.]*)[\s\S]*$/, '$1');
        const add1: string = listing.querySelector(LISTING_ADD1_SELECTOR)?.textContent ?? '';
        const add2: string = listing.querySelector(LISTING_ADD2_SELECTOR)?.textContent ?? '';
        const link: string =
          `www.realtor.com${listing.querySelector('a')?.getAttribute('href')}` ?? '';

        return {
          price,
          adjustedPrice,
          beds,
          baths,
          sqft,
          lotSize,
          add1,
          add2,
          link,
        };
      })
      .filter((listing): listing is RealtorComListing => !!listing); // Filter out undefined values
  });

  return listingData;
};
