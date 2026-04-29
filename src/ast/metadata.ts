import type { Token } from '../lexer/tokens';
import type { NodeMetadata } from '.';
import type { Expression } from './expressions';
import type { Statement } from './statements';

let id = 0;

export function makeMetadata(
	startToken: Token | Statement | Expression,
	endToken?: Token | Statement | Expression,
	focus?: Token | Statement | Expression,
): NodeMetadata {
	const start = startToken.start;
	const end = (endToken ?? startToken).end;
	const { column, line } = focus ?? startToken;
	return {
		id: id++,
		start,
		end,
		column,
		line,
	};
}

export function resetMetadataId() {
	id = 0;
}
