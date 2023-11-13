import { type sheets_v4 } from 'googleapis';

export type Sheets = sheets_v4.Sheets;

interface DictionaryListing {
  listingAddress: string;
  listingPrice: string;
}

export type listingDictionaryObject = Record<string, DictionaryListing>;

export interface Listing {
  price: string;
  adjustedPrice: string;
  beds: string;
  baths: string;
  sqft: string;
  lotSize: string;
  add1: string;
  add2: string;
}
