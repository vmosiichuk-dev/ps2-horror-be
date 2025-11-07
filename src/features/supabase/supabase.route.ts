import type { Request, Response } from 'express';
import { Router } from 'express';
import { ENV } from '../../config/env.ts';

export const supabaseRouter = Router();

supabaseRouter.post('/verify-captcha', async (req: Request, res: Response) => {
	try {
		const token = req.body?.token as string | undefined;
		if (!token) return res.status(400).json({ success: false, message: 'Missing captcha token' });

		const params = new URLSearchParams({
			secret: ENV.TURNSTILE_SECRET_KEY,
			response: token,
		});

		const response = await fetch(ENV.TURNSTILE_VERIFY_URL, {
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: params.toString(),
		});

		if (!response.ok) {
			console.error(`Turnstile captcha verification failed: ${response.statusText}`);
			return res.status(502).json({ success: false, message: 'Verification service error' });
		}

		const data: { success: boolean } = await response.json();
		return res.status(200).json({ success: data.success });
	} catch (error) {
		console.error('Turnstile captcha verification failed', error);
		return res.status(500).json({ success: false, message: 'Internal server error' });
	}
});
