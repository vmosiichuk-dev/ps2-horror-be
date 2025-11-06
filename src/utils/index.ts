const CAMEL_CASE_REGEX = /[-_\s]+([a-z])/g;

export const toCamelCase = (string: string) => {
	return string
		.toLowerCase()
		.replace(CAMEL_CASE_REGEX, (_, letter: string) => letter.toUpperCase());
};

export const normalizeDBResponse = <T extends Record<string, unknown>>(
	data: Record<string, unknown>
) => {
	const infoItemEntries = Object.entries(data)
		.filter(([, value]) => value != null)
		.map(([key, value]) => [toCamelCase(key), value]);

	return Object.fromEntries(infoItemEntries) as T;
};

export const normalizeDBNumber = <T>(
	value: unknown,
	fallback: T
) => {
	const normalizedValue = isNaN(Number(value)) ? fallback : Number(value);
	return normalizedValue as T;
};
