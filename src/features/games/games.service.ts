import type { IGDBGame } from './games.types.ts';
import type { GameItem, Rating } from 'ps2-horror-shared/types'
import { fetchGameFromDB, fetchPriceFromDB } from '../../lib/supabase.service.ts';
import { ENV } from '../../config/env.ts';

import {
	formatAgeRatings,
	sortAgeRatings,
	formatCoverImage,
	formatCompanyInfo,
	formatReleaseInfo,
	formatWebsites,
	formatPrice,
	mergeGameFromDB,
} from './games.utils.ts';

export const formatGames = async (igdbGames: IGDBGame[] | unknown): Promise<GameItem[]> => {
	if (!igdbGames || !Array.isArray(igdbGames)) return [];

	const formatGame = async (game: IGDBGame): Promise<GameItem> => {
		const rating = Math.round(game.total_rating || game.rating || game.aggregated_rating || 0);
		const genres = (game.genres ?? []).map((genre) => genre.name);

		const [sbPrice, sbGame] = await Promise.all([
			fetchPriceFromDB(game.id),
			fetchGameFromDB(game.id),
		]);

		const formattedGame: GameItem = {
			id: game.id,
			slug: game.slug,
			title: game.name,
			summary: game.summary ?? '',
			genres: genres.slice(0, 4),
			filters: { play: false, wish: false },
			rating: (rating === 0 ? 'N/A' : rating) as Rating,
			ageRatings: sortAgeRatings(formatAgeRatings(game.age_ratings ?? [])),
			screenshot: `${ENV.SUPABASE_BUCKET_URL}/fallbacks/ps2collage.webp`,
			cover: formatCoverImage(game.cover),
			release: formatReleaseInfo(game.first_release_date),
			websites: formatWebsites(game.websites ?? [], game.name),
			company: formatCompanyInfo(game.involved_companies ?? []),
			price: formatPrice(sbPrice),
		};

		return sbGame
			? mergeGameFromDB(sbGame, { ...formattedGame, screenshots: game.screenshots })
			: formattedGame;
	};

	return await Promise.all(igdbGames.map(formatGame));
};
