// –– IGDB Game Item

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

// –– Supabase Game Item

export type SBScreenshot = { url?: string; index?: number; };

export type SBGameItem = {
	summary?: string;
	screenshot?: SBScreenshot;
	ageRatings?: IGDBAgeRating[];
	genres?: string[];
	websites?: Website[];
	company?: Company;
};

// –– Supabase Price Item

export type PriceCategory = 'loose' | 'cib' | 'newg' | '';
export type Price = number | 'n/a';

export type Prices = Record<PriceCategory, Price>;
export type PriceCategories = { main: PriceCategory; wish: PriceCategory; };

export type SBPriceItem = {
	categories: PriceCategories;
	prices: Prices;
};

// –– FE Game Item

export type Rating = number | 'N/A';
export type Website = { label: string; url: string };
export type AgeRating = { label: string; url: string; };
export type Company = { label: 'Developer' | 'Publisher'; name: string; };

export type ReleaseDate = string | 'Unknown';
export type YearsPast = number | '';
export type Release = { releaseDate: ReleaseDate; yearsPast: YearsPast; };

export type Filters = { play: boolean; wish: boolean; };

export type GamePrice = {
	loose: Price;
	cib: Price;
	newg: Price;
	category: {
		main: PriceCategory;
		wish: PriceCategory;
	};
};

export type GameItem = {
	id: number,
	slug: string;
	title: string;
	summary: string;
	genres: string[];
	filters: Filters;
	rating: Rating;
	ageRatings: AgeRating[];
	screenshot: string;
	cover: string;
	release: Release;
	websites: Website[];
	company?: Company;
	price?: GamePrice;
};
