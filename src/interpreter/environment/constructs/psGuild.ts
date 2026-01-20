import { PSChannel, PSChannelCreationData } from './psChannel';
import { PSMember, PSMemberCreationData } from './psMember';
import { PSRole, PSRoleCreationData } from './psRole';
import { PSUser } from './psUser';
import { ImageUrlOptions } from '../types';

export interface PSGuildCreationData {
	id: string;
	name: string;
	ownerId: string;
	description?: string | null;
	systemChannelId?: string | null;
	iconUrlHandler: (options?: ImageUrlOptions) => string | null;
	bannerUrlHandler: (options?: ImageUrlOptions) => string | null;
	splashUrlHandler: (options?: ImageUrlOptions) => string | null;
	premiumTier?: number | null;
	channels: Omit<PSChannelCreationData, 'guild'>[];
	roles: Omit<PSRoleCreationData, 'guild'>[];
	members: Omit<PSMemberCreationData, 'guild'>[];
}

export class PSGuild {
	id: string;
	name: string;
	owner: PSMember;
	description: string | null;
	#systemChannel: PSChannel | null;
	#iconUrlHandler: (options?: ImageUrlOptions) => string | null;
	#bannerUrlHandler: (options?: ImageUrlOptions) => string | null;
	#splashUrlHandler: (options?: ImageUrlOptions) => string | null;
	premiumTier: number | null;
	channels: Map<string, PSChannel>;
	roles: Map<string, PSRole>;
	members: Map<string, PSMember>;

	constructor(data: PSGuildCreationData) {
		const {
			id, name, ownerId, description = null, systemChannelId, iconUrlHandler, bannerUrlHandler, splashUrlHandler, premiumTier = null, channels, roles, members,
		} = data;

		this.id = id;
		this.name = name;
		this.description = description;
		this.#iconUrlHandler = iconUrlHandler;
		this.#bannerUrlHandler = bannerUrlHandler;
		this.#splashUrlHandler = splashUrlHandler;
		this.premiumTier = premiumTier;

		this.channels = new Map();
		for(const channelData of channels) {
			const channel = new PSChannel({ ...channelData, guild: this });
			this.channels.set(channel.id, channel);
		}

		this.roles = new Map();
		for(const roleData of roles) {
			const role = new PSRole({ ...roleData, guild: this });
			this.roles.set(role.id, role);
		}

		this.members = new Map();
		for(const memberData of members) {
			const member = new PSMember({ ...memberData, guild: this });
			this.members.set(member.id, member);
		}

		const owner = this.members.get(ownerId);
		this.owner =
			owner ??
			new PSMember({
				user: new PSUser({
					id: ownerId,
					username: 'Dueño desconocido',
					displayName: 'Nombre de dueño desconocido',
				}),
				guild: this,
				roleIds: [],
				displayAvatarUrlHandler: () => '',
			});

		if(systemChannelId) {
			const systemChannel = this.channels.get(systemChannelId);
			if(!systemChannel) throw new ReferenceError('System channel not found');
			this.#systemChannel = systemChannel;
		}
	}

	get systemChannel() {
		return this.#systemChannel;
	}

	registerChannel(data: Omit<PSChannelCreationData, 'guild'>): PSChannel {
		const channel = new PSChannel({ ...data, guild: this });
		this.channels.set(channel.id, channel);
		return channel;
	}

	registerRole(data: Omit<PSRoleCreationData, 'guild'>): PSRole {
		const role = new PSRole({ ...data, guild: this });
		this.roles.set(role.id, role);
		return role;
	}

	registerMember(data: Omit<PSMemberCreationData, 'guild'>): PSMember {
		const member = new PSMember({ ...data, guild: this });
		this.members.set(member.id, member);
		return member;
	}

	registerChannels(
		...channelsData: Omit<PSChannelCreationData, 'guild'>[]
	): Map<string, PSChannel> {
		const channels = new Map();

		for(const data of channelsData) channels.set(data.id, this.registerChannel(data));

		return channels;
	}

	registerRoles(...rolesData: Omit<PSRoleCreationData, 'guild'>[]): Map<string, PSRole> {
		const roles = new Map();

		for(const data of rolesData) roles.set(data.id, this.registerRole(data));

		return roles;
	}

	registerMembers(...membersData: Omit<PSMemberCreationData, 'guild'>[]): Map<string, PSMember> {
		const members = new Map();

		for(const data of membersData) members.set(data.user.id, this.registerMember(data));

		return members;
	}

	setSystemChannel(id: string) {
		const systemChannel = this.channels.get(id);
		if(!systemChannel) throw new ReferenceError(`Channel for ID "${id}" not found`);
		this.#systemChannel = systemChannel;
	}

	iconUrl(options?: ImageUrlOptions) {
		return this.#iconUrlHandler(options);
	}

	bannerUrl(options?: ImageUrlOptions) {
		return this.#bannerUrlHandler(options);
	}

	splashUrl(options?: ImageUrlOptions) {
		return this.#splashUrlHandler(options);
	}

	toString() {
		return this.name;
	}

	get [Symbol.toStringTag]() {
		return this.toString();
	}
}
