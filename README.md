# Real Estate Scraper and Google Sheet Updater

## Overview

This project is designed to scrape MLS (Multiple Listing Service) data from a specified website (Realtor.com) and automatically fill and format a Google Sheet with the relevant information. It utilizes Puppeteer for web scraping and the Google Sheets API through googleapis to update the sheet seamlessly.

## Features

- **MLS Data Scraping**: Automates the extraction of real estate data from the target website.
- **Google Sheet Integration**: Updates a Google Sheet with the scraped data.
- **Efficient Formatting**: Ensures proper formatting and organization of data in the Google Sheet.

## Prerequisites

Before using this tool, make sure you have the following:

- Node.js installed
- Google API credentials for the Google Sheets API
- Google Sheet ID for the target spreadsheet

## Setup

1. Clone the repository:
   `git clone [https://github.com/yourusername/realestatescraper.git](https://github.com/Jmartimus/rescraper)`

2. Configure Google API Credentials:
   Follow the instructions to obtain Google API credentials and save them in a file named rescraper-key.json in the root directory.
   Ensure that the credentials are correctly imported in the googlesheets/auth.ts file.

3. Set Google Sheet ID in Configuration: Get the ID of the target Google Sheet.
   Open the secrets.ts file and set the GOOGLE_SHEET_ID variable to the obtained ID as `const spreadsheetId`.

4. Install Yarn: Ensure that Yarn is installed on your machine. If not, you can install it using:
   `npm install -g yarn`

5. Run the build command to compile TypeScript files: `yarn build`

6. Start the Scraper: `yarn start`

These steps should initialize the Real Estate Scraper, fetch data from the specified MLS website, and update the configured Google Sheet accordingly.
