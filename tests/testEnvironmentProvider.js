const { EnvironmentProvider, PSGuild, PSUser } = require('../src/interpreter/environment/environmentProvider');

/**@implements {EnvironmentProvider}*/
class TestEnvironmentProvider {
	constructor() {
		this.guild = new PSGuild({
			id: '123456789012345678',
			name: 'Servidor de Prueba',
			ownerId: '123456789012345684',
			description: 'Este ser un servidor que realmente no existe',
			systemChannelId: '123456789012345680',
			iconUrlHandler: this.#testUrlHandler,
			bannerUrlHandler: this.#testUrlHandler,
			splashUrlHandler: this.#testUrlHandler,
			premiumTier: 0,
			channels:  [
				{
					id: '123456789012345680',
					name: 'canal-de-prueba-2',
					nsfw: false,
				},
			],
			roles: [
				{
					id: '123456789012345681',
					name: 'Rol de Prueba 1',
					iconUrlHandler: (data) => 'https://i.imgur.com/ALNMRS6.png',
					color: 0x608cf3,
				},
				{
					id: '123456789012345682',
					name: 'Rol de Prueba 2',
					iconUrlHandler: (data) => null,
				},
			],
			members: [
				{
					user: new PSUser({
						id: '123456789012345683',
						username: 'usuario.de.prueba',
						displayName: 'Usuario de Prueba',
					}),
					displayAvatarUrlHandler: (data) => 'https://i.imgur.com/P9eeVWC.png',
					roleIds: [ '123456789012345682' ],
				},
				{
					user: new PSUser({
						id: '123456789012345684',
						username: 'otro.usuario',
						displayName: 'Otro Usuario',
					}),
					nickname: 'Otro Usuario',
					displayAvatarUrlHandler: (data) => 'https://i.imgur.com/P9eeVWC.png',
					roleIds: [],
				},
			]
		});

		this.channel = this.guild.registerChannel({
			id: '123456789012345679',
			name: 'canal-de-prueba-1',
			nsfw: false,
		});

		this.user = new PSUser({
			id: '651250669390528561',
			username: 'botdepure',
		});

		this.member = this.guild.registerMember({
			user: this.user,
			nickname: 'Bot de Puré',
			displayAvatarUrlHandler: (data) => 'https://i.imgur.com/P9eeVWC.png',
			roleIds: [ '123456789012345681', '123456789012345682' ],
		});
	}
	
	getGuild() {
		return this.guild;
	}

	getChannel() {
		return this.channel;
	}

	getUser() {
		return this.user;
	}

	getMember() {
		return this.member;
	}

	/**@param {string} query*/
	fetchChannel(query) {
		if(!isNaN(+query)) {
			const channel = this.guild.channels.get(query);
			if(channel) return channel;
		}

		let bestScore = 0;
		let bestMatch = null;

		for(const channel of this.guild.channels.values()) {
			if(channel.name.includes(query) && channel.name.length > bestScore) {
				bestScore = channel.name.length;
				bestMatch = channel;
			}
		}

		return bestMatch;
	}

	/**@param {string} query*/
	fetchRole(query) {
		if(!isNaN(+query)) {
			const role = this.guild.roles.get(query);
			if(role) return role;
		}

		let bestScore = 0;
		let bestMatch = null;

		for(const roles of this.guild.roles.values()) {
			if(roles.name.includes(query) && roles.name.length > bestScore) {
				bestScore = roles.name.length;
				bestMatch = roles;
			}
		}

		return bestMatch;
	}

	/**@param {string} query*/
	fetchMember(query) {
		if(!isNaN(+query)) {
			const member = this.guild.members.get(query);
			if(member) return member;
		}

		let bestScore = 0;
		let bestMatch = null;

		for(const member of this.guild.members.values()) {
			const tryName = (/**@type {string?}*/ name) => {
				if(name && name.includes(query) && name.length > bestScore) {
					bestScore = name.length;
					bestMatch = member;
					return true;
				}
				return false;
			}

			if(tryName(member.nickname)) continue;
			if(tryName(member.user.displayName)) continue;
			if(tryName(member.user.username)) continue;
		}

		return bestMatch;
	}

	/**
	 * @param {import('../src/interpreter/environment/environmentProvider').ImageUrlOptions} data 
	 */
	#testUrlHandler(data) {
		return '';
	}
}

module.exports = {
	TestEnvironmentProvider,
};
