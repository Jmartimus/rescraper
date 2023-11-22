import { type Sheets } from '../types';
import { addressColumnIndex, linkColumnIndex } from './constants';
import {
  createListingDictionaryObject,
  fetchPricesAndAddressesFromSheet,
  strikethroughOutdatedListings,
  updatePriceCellsRequests,
} from './utils';

/**
 * Appends new data to a Google Sheet, updates prices, strikes through outdated listings, and removes duplicates.
 *
 * @param {Sheets} sheets - Google Sheets API instance.
 * @param {string} spreadsheetId - ID of the Google Spreadsheet.
 * @param {string} range - Range to append data to.
 * @param {string[][]} data - Array of new data to append.
 */
export const appendDataToSheet = async (
  sheets: Sheets,
  spreadsheetId: string,
  range: string,
  data: string[][],
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
) => {
  try {
    const { listingPrices, listingAddresses } = await fetchPricesAndAddressesFromSheet(
      sheets,
      spreadsheetId,
    );

    const flattenedAddresses = listingAddresses ? listingAddresses.flat() : [];

    const dictionaryObject = createListingDictionaryObject(listingAddresses, listingPrices);

    // Append new data
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: data,
      },
    });

    const { outdatedListingFormatRequests } = strikethroughOutdatedListings(
      flattenedAddresses,
      data,
      dictionaryObject,
    );

    const updatePriceRequests = updatePriceCellsRequests(
      data,
      flattenedAddresses,
      dictionaryObject,
    );

    const updateRequests = [
      ...updatePriceRequests,
      ...outdatedListingFormatRequests,
      ...data.map((row, rowIndex) => {
        return {
          repeatCell: {
            range: {
              sheetId: 0,
              startRowIndex: rowIndex + 1,
              endRowIndex: rowIndex + 2,
              startColumnIndex: linkColumnIndex,
              endColumnIndex: linkColumnIndex + 1,
            },
            cell: {
              userEnteredValue: {
                formulaValue: `=HYPERLINK("${row[linkColumnIndex]}", "listing-link")`,
              },
            },
            fields: 'userEnteredValue.formulaValue',
          },
        };
      }),
      {
        deleteDuplicates: {
          range: {
            sheetId: 0,
          },
          comparisonColumns: [
            {
              sheetId: 0,
              dimension: 'COLUMNS',
              startIndex: addressColumnIndex,
              endIndex: addressColumnIndex + 1,
            },
          ],
        },
      },
    ];

    // Remove dupes, update prices, strikethrough old data
    const batchUpdateRequest = {
      spreadsheetId,
      resource: {
        requests: updateRequests,
      },
    };

    await sheets.spreadsheets.batchUpdate(batchUpdateRequest);
  } catch (error) {
    console.error('Error appending data to Google Sheet:', error);
  }
};
