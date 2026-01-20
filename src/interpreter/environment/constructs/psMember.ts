import { PSGuild } from './psGuild';
import { PSRole } from './psRole';
import { PSUser } from './psUser';
import { ImageUrlOptions } from '../types';

export interface PSMemberCreationData {
	guild: PSGuild;
	user: PSUser;
	nickname?: string;
	roleIds: string[];
	displayAvatarUrlHandler: (options?: ImageUrlOptions) => string;
}

export class PSMember {
	guild: PSGuild;
	user: PSUser;
	nickname: string | null;
	roles: Map<string, PSRole>;
	#displayAvatarUrlHandler: (options?: ImageUrlOptions) => string;

	constructor(data: PSMemberCreationData) {
		const { guild, user, roleIds, nickname = null, displayAvatarUrlHandler } = data;
		this.guild = guild;
		this.user = user;
		this.nickname = nickname;
		this.roles = new Map();
		this.#displayAvatarUrlHandler = displayAvatarUrlHandler;
		roleIds.forEach((roleId) => {
			const role = guild.roles.get(roleId);
			if(role) this.roles.set(roleId, role);
		});
	}

	get id() {
		return this.user.id;
	}

	get displayName() {
		return this.nickname || this.user.displayName;
	}

	displayAvatarUrl(options?: ImageUrlOptions) {
		return this.#displayAvatarUrlHandler(options);
	}

	toString() {
		return this.user.toString();
	}

	get [Symbol.toStringTag]() {
		return this.user.toString();
	}
}
