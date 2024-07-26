# Real Estate Scraper and Google Sheet Updater

## Overview

This project is designed to scrape MLS (Multiple Listing Service) data from a specified website (OneHome.com or Realtor.com) and automatically fill and format a Google Sheet with the relevant information. It utilizes Puppeteer for web scraping and the Google Sheets API through googleapis to update the sheet seamlessly.

## Features

- **MLS Data Scraping**: Automates the extraction of real estate data from the target website.
- **Google Sheet Integration**: Updates a Google Sheet with the scraped data.
- **Efficient Formatting**: Ensures proper formatting and organization of data in the Google Sheet.
- **Easy Deployment**: Utilizes Fly.io for seamless deployment and hosting of the web scraper.

## Prerequisites

Before using this tool, make sure you have the following:

- Node.js installed
- Google API credentials for the Google Sheets API
- Google Sheet ID for the target spreadsheet
- A Fly.io account for deployment

## Setup

1. Clone the repository:
   `git clone [https://github.com/yourusername/realestatescraper.git](https://github.com/Jmartimus/rescraper)`

2. Configure Google API Credentials:
   - Follow the instructions to obtain Google API credentials and save them in a file named rescraper-key.json in the public directory. 
   - Ensure that the credentials are correctly imported in the googlesheets/auth.ts file.

3. Set Google Sheet ID in Configuration: Get the ID of the target Google Sheet.
   Open the secrets.ts file and set the GOOGLE_SHEET_ID variable to the obtained ID as `const spreadsheetId`.
   
4. Set queryString: In secrets.ts set your oneHome or realtor.com query string.  You will need to get a real estate agent to set up a query for you in oneHome and then send you that link.  Then you plug it in there. Or you can go to realtor.com and set up your own custom query string. 

**If you use realtor.com, you will need to change the code a bit.  But there is functionality to handle realtor.com query strings**

5. Install Yarn: Ensure that Yarn is installed on your machine. If not, you can install it using:
   `npm install -g yarn`

6. Run the build command to compile TypeScript files: `yarn build:dev`

7. Start the Scraper: `yarn start`

These steps should initialize the Real Estate Scraper, fetch data from the specified MLS website, and update the configured Google Sheet accordingly.

## Deployment with Fly.io
To deploy the project using Fly.io:

1. Sign up for a Fly.io account if you haven't already.
2. Follow Fly.io documentation to set up your application.
3. Update the necessary configuration files for deployment, such as fly.toml and run `fly deploy` to redeploy app with new changes.
**Just because you merge code, does not mean this gets redeployed**