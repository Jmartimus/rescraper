// eslint-disable-next-line import/no-unresolved
import { AUTH_MESSAGES } from './constants.js';

/* eslint-disable @typescript-eslint/explicit-function-return-type */
const loginForm = document.getElementById('loginForm') as HTMLFormElement;
const usernameInput = document.getElementById('username') as HTMLInputElement;
const passwordInput = document.getElementById('password') as HTMLInputElement;
const loginButton = document.getElementById('loginButton') as HTMLButtonElement;
const scraperControls = document.getElementById('scraperControls') as HTMLElement;
const scrapeButton = document.getElementById('scrapeButton') as HTMLButtonElement;
const statusDiv = document.getElementById('status') as HTMLDivElement;
const authStatusDiv = document.getElementById('authStatus') as HTMLDivElement;
// eslint-disable-next-line prefer-const
let ws: WebSocket;
let scrapingCompleted = false;

const updateStatus = (message: string) => {
  statusDiv.textContent = message;
};

const updateAuthStatus = (message: string) => {
  authStatusDiv.textContent = message;
};

const toggleDisabledButtonState = (disabled: boolean) => {
  scrapeButton.disabled = disabled;
  scrapeButton.innerText = disabled ? 'Scraping...' : 'Scrape';
};

loginButton.addEventListener('click', () => {
  const username = usernameInput.value;
  const password = passwordInput.value;

  // Send login credentials to the server
  ws.send(JSON.stringify({ username, password }));
});

scrapeButton.addEventListener('click', () => {
  if (scrapingCompleted) {
    scrapeButton.disabled = true;
    scrapeButton.innerText = 'Reloading...';
    location.reload();
  } else {
    toggleDisabledButtonState(true);
    updateStatus('Loading scraper...');
    ws.send('Scraping...');
  }
});

// WebSocket setup
ws = new WebSocket('ws://localhost:8080');
ws.onopen = () => {
  console.log('WebSocket connection established.');
};

ws.onmessage = (event) => {
  const message = event.data;
  console.log('Received message from server:', message);

  if (message.startsWith(AUTH_MESSAGES.SUCCESS)) {
    // Hide login form and show scraper controls
    loginForm.style.display = 'none';
    scraperControls.style.display = 'flex';
    toggleDisabledButtonState(false);
    updateAuthStatus(AUTH_MESSAGES.SUCCESS);
  } else if (message.startsWith(AUTH_MESSAGES.DENIED)) {
    updateAuthStatus(`${AUTH_MESSAGES.DENIED} - Refresh page to try again.`);
  } else {
    updateStatus(message);
  }
};

ws.onclose = () => {
  console.log('WebSocket connection closed.');
  toggleDisabledButtonState(false);
  updateStatus('Scraping completed!');
  scrapingCompleted = true;
  scrapeButton.innerText = 'Reload page';
};

ws.onerror = (error) => {
  console.error('WebSocket error:', error);
  toggleDisabledButtonState(false);
  updateStatus(`Error: ${(error as ErrorEvent).message}`);
};
