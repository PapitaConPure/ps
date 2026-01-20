import { ALLOWED_SIZES, ALLOWED_EXTENSIONS } from './environmentProvider';

export interface ImageUrlOptions {
	size?: (typeof ALLOWED_SIZES)[number];
	extension?: (typeof ALLOWED_EXTENSIONS)[number];
}
