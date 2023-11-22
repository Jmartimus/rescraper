import express, { type Request, type Response } from 'express';
import { runReScraper } from '../scraper';

const app = express();
const port = 8080;

app.get('/scrape', (_req: Request, res: Response) => {
  runReScraper()
    .then(() => {
      res.send('Scraping completed successfully.');
    })
    .catch((error) => {
      console.error('Error during scraping:', error);
      res.status(500).send('Internal Server Error');
    });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
