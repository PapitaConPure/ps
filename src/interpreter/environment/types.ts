import type { ALLOWED_EXTENSIONS, ALLOWED_SIZES } from './environmentProvider';

export interface ImageUrlOptions {
	size?: (typeof ALLOWED_SIZES)[number];
	extension?: (typeof ALLOWED_EXTENSIONS)[number];
}
