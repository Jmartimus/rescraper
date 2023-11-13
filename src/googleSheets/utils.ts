/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { type listingDictionaryObject, type Sheets } from '../types';
import { addressColumnRange, addressIndexFromData, priceColumnRange } from './constants';

/**
 * Fetches prices and addresses data from a Google Sheet.
 *
 * @param {Sheets} sheets - Google Sheets API instance.
 * @param {string} spreadsheetId - ID of the Google Spreadsheet.
 * @returns {Promise<{listingPrices: string[][] | null, listingAddresses: string[][] | null}>} - Promise resolving to an object containing listingPrices and listingAddresses arrays.
 * @throws {Error} - Throws an error if there is an issue fetching data from the Google Sheet.
 */
export const fetchPricesAndAddressesFromSheet = async (sheets: Sheets, spreadsheetId: string) => {
  try {
    const existingValues = await sheets.spreadsheets.values.batchGet({
      spreadsheetId,
      ranges: [priceColumnRange, addressColumnRange],
    });

    const listingPrices: string[][] | null = existingValues.data.valueRanges?.[0].values ?? null;
    const listingAddresses: string[][] | null = existingValues.data.valueRanges?.[1].values ?? null;

    return { listingPrices, listingAddresses };
  } catch (error) {
    console.error('Error fetching data from Google Sheet:', error);
    throw error;
  }
};

/**
 * Creates a dictionary object from listing addresses and prices.
 *
 * @param {string[][] | null} listingAddresses - Array of listing addresses.
 * @param {string[][] | null} listingPrices - Array of listing prices.
 * @returns {listingDictionaryObject} - Dictionary object mapping listing addresses to listing objects.
 */
export const createListingDictionaryObject = (
  listingAddresses: string[][] | null,
  listingPrices: string[][] | null,
) => {
  const dictionaryObject: listingDictionaryObject = {};

  if (listingAddresses && listingPrices) {
    for (let i = 0; i < listingAddresses.length; i++) {
      const listingAddress = listingAddresses[i][0];
      const listingPrice = listingPrices[i][0];

      if (listingAddress && listingPrice) {
        dictionaryObject[listingAddress] = { listingAddress, listingPrice };
      }
    }
  }

  return dictionaryObject;
};

/**
 * Generates requests to strike through outdated listings.
 *
 * @param {string[]} flattenedAddresses - Flattened array of listing addresses.
 * @param {string[][]} data - Array of new data.
 * @param {listingDictionaryObject} dictionaryObject - Dictionary object of listing addresses.
 * @returns {{outdatedListings: number[], outdatedListingFormatRequests: Object[]}} - Object containing arrays of outdated listings and formatting requests.
 */
export const strikethroughOutdatedListings = (
  flattenedAddresses: string[],
  data: string[][],
  dictionaryObject: listingDictionaryObject,
) => {
  const outdatedListingAddresses = Object.keys(dictionaryObject).filter((listingAddress) => {
    return !data.some((item) => item[addressIndexFromData] === listingAddress);
  });

  const outdatedListings = outdatedListingAddresses
    .map((address) => {
      const index = flattenedAddresses.indexOf(address);
      return index !== -1 ? index + 2 : null;
    })
    .filter(Boolean);

  const outdatedListingFormatRequests = outdatedListings.map((startRowIndex) => {
    if (startRowIndex) {
      return {
        repeatCell: {
          range: {
            sheetId: 0,
            startRowIndex: startRowIndex - 1,
            endRowIndex: startRowIndex,
            startColumnIndex: 0,
            endColumnIndex: 8,
          },
          cell: {
            userEnteredFormat: {
              textFormat: {
                strikethrough: true,
              },
              backgroundColor: {
                red: 0.9,
                green: 0.9,
                blue: 0.9,
              },
            },
          },
          fields: 'userEnteredFormat.textFormat.strikethrough,userEnteredFormat.backgroundColor',
        },
      };
    }
    return null;
  });

  return { outdatedListings, outdatedListingFormatRequests };
};

/**
 * Generates requests to update price cells.
 *
 * @param {string[][]} data - Array of new data.
 * @param {string[]} flattenedAddresses - Flattened array of listing addresses.
 * @param {listingDictionaryObject} dictionaryObject - Dictionary object of listing addresses.
 * @returns {Object[]} - Array of update requests for price cells.
 */
export const updatePriceCellsRequests = (
  data: string[][],
  flattenedAddresses: string[],
  dictionaryObject: listingDictionaryObject,
) => {
  return data
    .map((newItem) => {
      const address = newItem[addressIndexFromData];
      const rowIndex = flattenedAddresses.indexOf(address) + 2;

      if (dictionaryObject[address] && dictionaryObject[address].listingPrice !== newItem[0]) {
        const request1 = {
          repeatCell: {
            range: {
              sheetId: 0,
              startRowIndex: rowIndex - 1,
              endRowIndex: rowIndex,
              startColumnIndex: 0,
              endColumnIndex: 1,
            },
            cell: {
              userEnteredValue: {
                stringValue: newItem[0],
              },
            },
            fields: 'userEnteredValue',
          },
        };

        const request2 = {
          repeatCell: {
            range: {
              sheetId: 0,
              startRowIndex: rowIndex - 1,
              endRowIndex: rowIndex,
              startColumnIndex: 1,
              endColumnIndex: 2,
            },
            cell: {
              userEnteredValue: {
                stringValue: newItem[1],
              },
            },
            fields: 'userEnteredValue',
          },
        };

        return [request1, request2];
      }

      return null;
    })
    .filter(Boolean)
    .flat();
};
