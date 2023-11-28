import express from 'express';
import http from 'http';
import { Server as WebSocketServer } from 'ws';
import { runReScraper } from '../scraper';
import { type AuthorizedWebSocket, authenticateUser } from './authenticate';

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const port = 8080;

wss.on('connection', (ws: AuthorizedWebSocket) => {
  ws.isAuthorized = false;
  ws.on('message', (message: string) => {
    if (!ws.isAuthorized) {
      authenticateUser(ws, message);
    } else {
      console.log('User is authorized!');
      runReScraper(ws)
        .then(() => {
          ws.send('Scraping completed successfully.');
        })
        .catch((error) => {
          console.error('Error during scraping:', error);
          ws.send('Internal Server Error');
        });
    }
  });
});

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
