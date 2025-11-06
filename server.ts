import { app } from './src';
import { ENV } from './src/config/env';

app.listen(ENV.PORT, () => {
	console.info(`Server listening on port ${ENV.PORT}`);
});
