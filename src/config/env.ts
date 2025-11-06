import dotenv from 'dotenv';
dotenv.config();

const REQUIRED = [
	'IGDB_API_BASE_URL',
	'IGDB_API_AUTH_URL',
	'IGDB_ASSET_RATING_URL',
	'IGDB_ASSET_SCREENSHOT_URL',
	'IGDB_ASSET_COVER_URL',
	'TWITCH_CLIENT_ID',
	'TWITCH_CLIENT_SECRET',
	'GOOGLE_SEARCH_URL',
	'SUPABASE_URL',
	'SUPABASE_SECRET_KEY',
	'SUPABASE_BUCKET_URL',
	'TURNSTILE_VERIFY_URL',
	'TURNSTILE_SECRET_KEY'
] as const;

type RequiredEnvKeys = typeof REQUIRED[number];
type RequiredEntities = [RequiredEnvKeys, string][];
type NodeEnvParams = { PORT: number; NODE_ENV: string; };
type EnvParams = Record<RequiredEnvKeys, string> & NodeEnvParams;

const missingRequired: RequiredEnvKeys[] = REQUIRED.filter((key: RequiredEnvKeys) => {
	return !process.env[key];
});

const requiredEntities: RequiredEntities = REQUIRED.map((envParam: RequiredEnvKeys) => {
	return [envParam, process.env[envParam]!];
});

if (missingRequired.length > 0) {
	const missingVariables = missingRequired.join(', ');
	throw new Error(`Missing required environment variables: ${missingVariables}`);
}

export const ENV = {
	PORT: Number(process.env.PORT ?? 8080),
	NODE_ENV: process.env.NODE_ENV ?? 'development',
	...Object.fromEntries(requiredEntities),
} as EnvParams;
