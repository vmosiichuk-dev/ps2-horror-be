import type {
	AgeRating,
	Company,
	GameItem,
	GamePrice,
	Price,
	Release,
	Website,
} from 'ps2-horror-shared/types';

import type {
	IGDBAgeRating,
	IGDBCompany,
	IGDBGame,
	IGDBWebsite,
	SBGameItem,
	SBPriceItem,
} from './games.types.ts';

import { ENV } from '../../config/env.ts';

const AGE_RATING_PRIORITY: Record<string, number> = {
	acb: 2,
	cero: 5,
	classind: 1,
	esrb: 7,
	grac: 3,
	pegi: 6,
	usk: 4,
	fallback: 0,
};

const normalizeDBNumber = <T>(
	value: unknown,
	fallback: T
) => {
	const normalizedValue = isNaN(Number(value)) ? fallback : Number(value);
	return normalizedValue as T;
};

export const sortAgeRatings = (ageRatings: AgeRating[]) => {
	if (ageRatings.length <= 3) return ageRatings;
	const organizations = Object.keys(AGE_RATING_PRIORITY);

	const sorted = ageRatings.sort((a, b) => {
		const aLabel = organizations.find(org => a.label.startsWith(org)) ?? 'fallback';
		const bLabel = organizations.find(org => b.label.startsWith(org)) ?? 'fallback';
		return AGE_RATING_PRIORITY[bLabel] - AGE_RATING_PRIORITY[aLabel];
	});

	return sorted.slice(0, 3);
};

export const formatAgeRatings = (
	ageRatings: IGDBAgeRating[]
): AgeRating[] => {
	return ageRatings.map((ageRating: IGDBAgeRating) => {
		const { organization, rating_category } = ageRating;

		const organizationName = organization?.name?.toLowerCase() || '';
		const categoryRating = rating_category?.rating?.toLowerCase() || '';

		const sanitizedCategory = categoryRating.replace(/\+/g, '').replace(/ /g, '_');

		return {
			label: (organizationName + categoryRating).replace(/[ _+]+/g, ''),
			url: `${ENV.IGDB_ASSET_RATING_URL}/${organizationName}/${organizationName}_${sanitizedCategory}.png`
		};
	});
};

export const formatCoverImage = (cover: IGDBGame['cover']) => {
	if (!cover?.image_id) return `${ENV.SUPABASE_BUCKET_URL}/fallbacks/nocover.webp`;
	else return `${ENV.IGDB_ASSET_COVER_URL}/${cover.image_id}.jpg`;
};

export const formatCompanyInfo = (
	companies: IGDBCompany[]
): Company | undefined => {
	if (!companies || companies.length === 0) return undefined;

	const dev = companies.find((company) => company.developer);

	return {
		label: dev ? 'Developer' : 'Publisher',
		name: dev ? dev.company.name : companies[0].company.name,
	}
};

export const formatReleaseInfo = (
	release: IGDBGame['first_release_date']
): Release => {
	if (!release) return { releaseDate: 'Unknown', yearsPast: '' };

	const now = new Date();
	const date = new Date(release * 1000);

	const dateTimeFormatOptions = {
		year: 'numeric',
		month: 'short',
		day: 'numeric'
	} as const;

	return {
		releaseDate: date.toLocaleDateString('en-us', dateTimeFormatOptions),
		yearsPast: now.getFullYear() - date.getFullYear()
	}
};

export const formatWebsites = (
	websites: IGDBWebsite[],
	title: IGDBGame['name']
) => {
	if (!websites || websites.length === 0) {
		const sanitizedTitle = title.toLowerCase().replace(/ /g, '+');
		const url = `${ENV.GOOGLE_SEARCH_URL}${sanitizedTitle}+ps2`;
		return [{ label: 'Google', url }];
	}

	return websites.map(({ type, url }): Website => ({ label: type.type, url }));
};

const CATEGORY_FALLBACK = '';
const PRICE_FALLBACK = 'n/a';

export const formatPrice = (
	price: SBPriceItem | null
): GamePrice => ({
	category: {
		main: price?.categories?.main ?? CATEGORY_FALLBACK,
		wish: price?.categories?.wish ?? CATEGORY_FALLBACK,
	},
	loose: normalizeDBNumber<Price>(price?.prices?.loose, PRICE_FALLBACK),
	cib: normalizeDBNumber<Price>(price?.prices?.cib, PRICE_FALLBACK),
	newg: normalizeDBNumber<Price>(price?.prices?.newg, PRICE_FALLBACK),
});

const _formatScreenshot = (
	game: GameItem & { screenshots: IGDBGame['screenshots'] },
	sbGame: SBGameItem,
) => {
	if (sbGame?.screenshot?.url) return sbGame.screenshot.url;
	if (!game.screenshots?.length) return game.screenshot;
	return `${ENV.IGDB_ASSET_SCREENSHOT_URL}/${game.screenshots[sbGame?.screenshot?.index ?? 0].image_id}.jpg`;
};

export const mergeGameFromDB = async (
	sbGame: SBGameItem,
	game: GameItem & { screenshots: IGDBGame['screenshots'] }
): Promise<GameItem> => {
	const { screenshots, ...gameItem } = game;
	const { screenshot, ageRatings, ...sbGameItem } = sbGame ?? {};

	return {
		...gameItem,
		...sbGameItem,
		...(ageRatings ? { ageRatings: formatAgeRatings(ageRatings) } : {}),
		screenshot: _formatScreenshot(game, sbGame),
	};
};
