import express from 'express';
import http from 'http';
import { Server as WebSocketServer } from 'ws';
import { runReScraper } from '../scraper';

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const port = 8080;

wss.on('connection', (ws) => {
  ws.on('message', (message: string) => {
    console.log(`Received message: ${message}`);
  });

  runReScraper(ws)
    .then(() => {
      ws.send('Scraping completed successfully.');
    })
    .catch((error) => {
      console.error('Error during scraping:', error);
      ws.send('Internal Server Error');
    });
});

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
