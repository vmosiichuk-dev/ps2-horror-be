import type {
	Website,
	Company,
	Price,
	PriceCategory,
} from 'ps2-horror-shared/types';

export type IGDBWebsite = {
	url: string
	type: { type: string; };
};

export type IGDBAgeRating = {
	organization: { name: string; };
	rating_category: { rating: string; };
};

export type IGDBCompany = {
	developer?: boolean;
	company: { name: string; };
};

export type IGDBGame = {
	id: number;
	slug: string;
	name: string;
	summary?: string;
	rating?: number;
	total_rating?: number;
	aggregated_rating?: number;
	first_release_date?: number;
	age_ratings?: IGDBAgeRating[];
	genres?: { name: string; }[];
	cover?: { image_id: string; };
	screenshots?: { image_id: string; }[];
	involved_companies?: IGDBCompany[];
	websites?: IGDBWebsite[];
};

export type SBScreenshot = { url?: string; index?: number; };

export type SBGameItem = {
	summary?: string;
	screenshot?: SBScreenshot;
	ageRatings?: IGDBAgeRating[];
	genres?: string[];
	websites?: Website[];
	company?: Company;
};

export type Prices = Record<PriceCategory, Price>;
export type PriceCategories = { main: PriceCategory; wish: PriceCategory; };

export type SBPriceItem = {
	categories: PriceCategories;
	prices: Prices;
};
