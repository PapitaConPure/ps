export interface PSUserCreationData {
	id: string;
	username: string;
	displayName?: string;
}

export class PSUser {
	id: string;
	username: string;
	#displayName: string | null;

	constructor(data: PSUserCreationData) {
		const { id, username, displayName = null } = data;
		this.id = id;
		this.username = username;
		this.#displayName = displayName;
	}

	get displayName() {
		return this.#displayName || this.username;
	}

	toString() {
		return `<@${this.id}>`;
	}

	get [Symbol.toStringTag]() {
		return this.toString();
	}
}
