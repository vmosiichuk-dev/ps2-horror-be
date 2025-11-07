import type { SBGameItem, SBPriceItem } from '../features/games/games.types.ts';
import type { Tables } from './database.types.ts';

import { supabase } from './supabase.ts';
import { toCamelCase } from 'ps2-horror-shared/utils';

const TABLES = { GAMES: 'games', PRICES: 'prices' } as const;
type TableName = (typeof TABLES)[keyof typeof TABLES];

export const normalizeDBResponse = <T extends Record<string, unknown>>(
	data: Record<string, unknown>
) => {
	const infoItemEntries = Object.entries(data)
		.filter(([, value]) => value != null)
		.map(([key, value]) => [toCamelCase(key), value]);

	return Object.fromEntries(infoItemEntries) as T;
};

const _fetchSingleItemFromDB = async <T extends TableName>(
	table: TableName,
	id: number
): Promise<Tables<T> | null> => {
	const { data, error, status } = await supabase
		.from(table)
		.select('*')
		.eq('id', id)
		.limit(1)
		.maybeSingle();

	if (error && status !== 406) {
		const consoleMessage = `Supabase '${table}' fetch failed for id ${id}.`;
		console.error(consoleMessage, error.message);
		throw new Error(consoleMessage);
	}

	return data as Tables<T> ?? null;
};

export const fetchGameFromDB = async (
	id: number
): Promise<SBGameItem | null> => {
	const games = await _fetchSingleItemFromDB(TABLES.GAMES, id);
	return games ? normalizeDBResponse<SBGameItem>(games) : null;
};

export const fetchPriceFromDB = async (
	id: number
): Promise<SBPriceItem | null> => {
	const prices = await _fetchSingleItemFromDB(TABLES.PRICES, id);
	return prices ? normalizeDBResponse<SBPriceItem>(prices) : null;
};
