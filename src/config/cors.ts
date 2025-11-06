import type { CorsOptions } from 'cors';

export const CORS_OPTIONS: CorsOptions = {
	origin: (origin, callback) => {
		const allowedOrigins = [
			'https://vmosiichuk.dev/ps2-horror',
			'http://localhost:5173',
			'http://127.0.0.1:8080'
		];

		if (!origin || allowedOrigins.includes(origin)) {
			callback(null, true);
		} else {
			callback(new Error(`CORS blocked for origin: ${origin}`));
		}
	},
	methods: ['GET', 'POST', 'OPTIONS'],
	allowedHeaders: ['Content-Type', 'X-Requested-With'],
	optionsSuccessStatus: 200,
};
