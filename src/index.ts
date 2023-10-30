import puppeteer, { type Browser, type Page } from 'puppeteer';

interface Listing {
  price: string;
  beds: string;
  baths: string;
  sqft: string;
  lotSize: string;
  add1: string;
  add2: string;
}

const searchRealtorCom = async (): Promise<void> => {
  const browser: Browser = await puppeteer.launch({
    headless: 'new',
    defaultViewport: null,
  });

  const page: Page = await browser.newPage();
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36',
  );
  await page.waitForTimeout(2000); // Wait for 2 seconds before making the next request

  await page.goto(
    'https://www.realtor.com/realestateandhomes-search/71115/type-single-family-home/show-price-reduced/pnd-hide/55p-hide/price-50000-200000/ns-1183429394,313709973,2082981926,1584339370,1456952945,3434912739,758137024?view=map',
    {
      waitUntil: 'domcontentloaded',
    },
  );

  const realtorComListings = async (): Promise<Listing[]> => {
    const listingData: Listing[] = await page.evaluate(() => {
      const listingList = document.querySelectorAll('[data-testid="card-content"]');
      return Array.from(listingList)
        .map((listing: Element) => {
          const priceEl: Element | null = listing.querySelector('[data-testid="card-price"]');
          const bedsEl: Element | null = listing.querySelector(
            '[data-testid="property-meta-beds"]',
          );
          const bathsEl: Element | null = listing.querySelector(
            '[data-testid="property-meta-baths"]',
          );
          const sqftEl: Element | null = listing.querySelector(
            '[data-testid="property-meta-sqft"]',
          );
          const lotSizeEl: Element | null = listing.querySelector(
            '[data-testid="property-meta-lot-size"]',
          );
          const add1El: Element | null = listing.querySelector('[data-testid="card-address-1"]');
          const add2El: Element | null = listing.querySelector('[data-testid="card-address-2"]');

          const price: string = priceEl?.textContent ?? '';
          const beds: string = (bedsEl?.textContent ?? '').replace(/^(\d[\d,.]*)[\s\S]*$/, '$1');
          const baths: string = (bathsEl?.textContent ?? '').replace(/^(\d[\d,.]*)[\s\S]*$/, '$1');
          const sqft: string = (sqftEl?.textContent ?? '').replace(/^(\d[\d,.]*)[\s\S]*$/, '$1');
          const lotSize: string = (lotSizeEl?.textContent ?? '').replace(
            /^(\d[\d,.]*)[\s\S]*$/,
            '$1',
          );
          const add1: string = add1El?.textContent ?? '';
          const add2: string = add2El?.textContent ?? '';

          return {
            price,
            beds,
            baths,
            sqft,
            lotSize,
            add1,
            add2,
          }; // Add a type assertion to indicate that this is of type Listing
        })
        .filter((listing): listing is Listing => !!listing); // Filter out undefined values
    });

    return listingData;
  };
  // const realtorSearch = await page.$('#search-bar');
  // await realtorSearch?.type('71118');
  // await page.keyboard?.press('Enter');
  // const priceFilterButton = await page.$('filter-btn-77381929');
  // await priceFilterButton?.click();
  // const maxPriceDropdown = await page.$('max-price-dropdown');
  // await maxPriceDropdown?.type('250000');
  // const minPriceDropdown = await page.$('min-price-dropdown');
  // await minPriceDropdown?.type('65000');
  // const viewButtonPriceFilter = await page.$('[data-testid="view-price-results"]');
  // await viewButtonPriceFilter?.click();
  // const quoteData: Array<{ text: string; author: string }> = await page.evaluate(() => {
  //   const quoteList = document.querySelectorAll('.quote');

  //   return Array.from(quoteList).map((quote: Element) => {
  //     const textElement: Element | null = quote.querySelector('.text');
  //     const authorElement: Element | null = quote.querySelector('.author');

  //     if (textElement && authorElement) {
  //       const text: string = textElement.textContent ?? '';
  //       const author: string = authorElement.textContent ?? '';

  //       return { text, author };
  //     } else {
  //       // Handle the case where the elements are not found or are null
  //       // You can return a default value or handle it according to your needs.
  //       return { text: '', author: '' };
  //     }
  //   });
  // });

  // return quoteData;

  console.log(await realtorComListings());

  // await page.click('.pager > .next > a');

  // console.log(await quotes());

  // Close the browser
  // await browser.close();
};

void searchRealtorCom();

// import puppeteer, { type Browser, type Page } from 'puppeteer';

// const getQuotes = async (): Promise<void> => {
//   const browser: Browser = await puppeteer.launch({
//     headless: false,
//     defaultViewport: null,
//   });

//   const page: Page = await browser.newPage();

//   await page.goto('http://www.realtor.com/', {
//     waitUntil: 'domcontentloaded',
//   });

//   const quotes = async (): Promise<Array<{ text: string; author: string }>> => {
//     const quoteData: Array<{ text: string; author: string }> = await page.evaluate(() => {
//       const quoteList = document.querySelectorAll('.quote');

//       return Array.from(quoteList).map((quote: Element) => {
//         const textElement: Element | null = quote.querySelector('.text');
//         const authorElement: Element | null = quote.querySelector('.author');

//         if (textElement && authorElement) {
//           const text: string = textElement.textContent ?? '';
//           const author: string = authorElement.textContent ?? '';

//           return { text, author };
//         } else {
//           return { text: '', author: '' };
//         }
//       });
//     });

//     return quoteData;
//   };

//   console.log(await quotes());

//   await page.click('.pager > .next > a');

//   console.log(await quotes());

//   await browser.close();
// };

// void getQuotes();
