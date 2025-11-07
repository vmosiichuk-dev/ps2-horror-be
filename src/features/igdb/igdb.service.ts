import { ENV } from '../../config/env.ts';

let cachedToken: string | null = null;
let tokenExpiration: number = 0;

const _getAuthToken = async (): Promise<string> => {
	const now = Date.now() / 1000;

	if (cachedToken && now < tokenExpiration) return cachedToken;

	const res = await fetch(ENV.IGDB_API_AUTH_URL, {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body: new URLSearchParams({
			client_id: ENV.TWITCH_CLIENT_ID,
			client_secret: ENV.TWITCH_CLIENT_SECRET,
			grant_type: 'client_credentials'
		})
	});

	if (!res.ok) {
		throw new Error(`Failed to fetch IGDB token: ${res.statusText}`);
	}

	const data = (await res.json()) as { access_token: string; expires_in: number };

	cachedToken = data.access_token;
	tokenExpiration = now + data.expires_in - 60;

	return cachedToken;
};

export const igdbRequest = async <T = unknown>(
	endpoint: string,
	body?: string,
	method: 'POST' | 'GET' = 'POST'
): Promise<T> => {
	const token = await _getAuthToken();

	const response = await fetch(`${ENV.IGDB_API_BASE_URL}/${endpoint}`, {
		method,
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'text/plain',
			'Authorization': `Bearer ${token}`,
			'Client-ID': ENV.TWITCH_CLIENT_ID,
		},
		body: method === 'POST' ? body : undefined,
	});

	if (!response.ok) {
		const text = await response.text();
		throw new Error(`IGDB API error (${response.status}): ${text}`);
	}

	return (await response.json()) as T;
};
