export enum STATUS_MESSAGES {
  STEP_1 = '1. Closed intro modal.',
  STEP_2 = '2. Closed map screen.',
  STEP_3 = '3. Closed feedback modal.',
  STEP_4 = '4. Clicking "load more" button until it disappears.',
  STEP_5 = '5. Scraping data.',
  STEP_6 = '6. Updating google sheet.',
  STEP_7 = '7. Google sheet updated with data successfully.',
  STEP_8 = '8. Scraping completed.',
}

export enum AUTH_MESSAGES {
  SUCCESS = 'Authentication successful.',
  DENIED = 'Authentication failed. User not allowed.',
}
