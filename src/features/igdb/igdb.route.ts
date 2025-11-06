import type { Request, Response } from 'express';
import type { IGDBGame } from '../games/games.types';
import { Router } from 'express';
import { formatGames } from '../games/games.service';
import { igdbRequest } from './igdb.service.ts';

export const igdbRouter = Router();

igdbRouter.all('/*endpoint', async (req: Request, res: Response) => {
	try {
		const endpoint = req.params.endpoint[0];
		const body = req.method === 'POST' ? req.body : undefined;
		const method = req.method as 'GET' | 'POST';

		const data = await igdbRequest(endpoint, body, method);

		if (endpoint.startsWith('games')) {
			const formattedGames = await formatGames(data as IGDBGame[]);
			return res.json(formattedGames);
		}

		res.json(data);
	} catch (err) {
		console.error('Proxy error:', err);
		res.status(500).json({ error: 'Proxy request failed' });
	}
});
