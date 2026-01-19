import { Token } from '../lexer/tokens';
import { Statement } from './statements';
import { Expression } from './expressions';
import { NodeMetadata } from '.';

let id = 0;

export function makeMetadata(startToken: Token | Statement | Expression, endToken: Token | Statement | Expression = undefined, focus: Token | Statement | Expression = undefined): NodeMetadata {
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
