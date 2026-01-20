import { PSGuild } from './psGuild';
import { ImageUrlOptions } from '../types';

export interface PSRoleCreationData {
	guild: PSGuild;
	id: string;
	name: string;
	iconUrlHandler: (options?: ImageUrlOptions) => string | null;
	color?: number;
}

export class PSRole {
	guild: PSGuild;
	id: string;
	name: string;
	#iconUrlHandler: (options?: ImageUrlOptions) => string | null;
	color: number;

	constructor(data: PSRoleCreationData) {
		const { id, name, guild, iconUrlHandler, color } = data;
		this.id = id;
		this.name = name;
		this.guild = guild;
		this.#iconUrlHandler = iconUrlHandler;
		this.color = color || 0x000000;
	}

	get hexColor() {
		return '#' + this.color.toString(16);
	}

	iconUrl(options?: ImageUrlOptions) {
		return this.#iconUrlHandler(options);
	}

	toString() {
		return `<@&${this.id}>`;
	}

	get [Symbol.toStringTag]() {
		return this.toString();
	}
}
