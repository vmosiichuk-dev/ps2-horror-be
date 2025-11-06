import type { Request, Response } from 'express';
import { Router } from 'express';
import { igdbRouter } from '../features/igdb/igdb.route';
import { supabaseRouter } from '../features/supabase/supabase.route';

export const router = Router();

router.get('/', (_req: Request, res: Response) => {
	res.json({ status: 'ok', timestamp: new Date().toISOString() });
})

router.use('/igdb', igdbRouter);
router.use('/supabase', supabaseRouter);

router.use((_req: Request, res: Response) => {
	res.status(404).json({ success: false, message: 'Route not found' });
});
