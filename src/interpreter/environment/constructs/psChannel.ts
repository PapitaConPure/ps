import { PSGuild } from './psGuild';

export interface PSChannelCreationData {
	guild: PSGuild;
	id: string;
	name: string;
	nsfw: boolean;
}

export class PSChannel {
	guild: PSGuild;
	id: string;
	name: string;
	nsfw: boolean;

	constructor(data: PSChannelCreationData) {
		const { id, name, guild, nsfw } = data;
		this.id = id;
		this.name = name;
		this.guild = guild;
		this.nsfw = nsfw;
	}

	toString() {
		return `<#${this.id}>`;
	}

	get [Symbol.toStringTag]() {
		return this.toString();
	}
}
