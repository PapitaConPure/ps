/**
 * @typedef {number
 *         | readonly [ red: number, green: number, blue: number ]
 *         | 'Random'
 *         | `#${string}`
 * } ColorResolvable
 */

/**
 * @typedef {Object} AuthorData
 * @property {string} name
 * @property {string} [iconUrl]
 * @property {string} [url]
 */

/**
 * @typedef {Object} FooterData
 * @property {string} text
 * @property {string} [iconUrl]
 */

/**
 * @typedef {Object} EmbedFieldData
 * 
 * @property {string} name
 * Name of the field.
 * 
 * Length limit: 256 characters
 * 
 * @property {string} value
 * Value of the field
 *
 * Length limit: 1024 characters
 * 
 * @property {boolean} [inline]
 * Whether or not this field should display inline
 */

/**
 * @typedef {Object} EmbedResolvable
 * @property {AuthorData?} author
 * @property {ColorResolvable?} color
 * @property {string?} description
 * @property {Array<EmbedFieldData>?} fields
 * @property {FooterData?} footer
 * @property {string?} imageUrl
 * @property {string?} thumbUrl
 * @property {(Date | number)?} timestamp
 * @property {string?} title
 * @property {string?} url
 */

class EmbedData {
	/**@type {AuthorData?}*/ #author;
	/**@type {ColorResolvable?}*/ #color;
	/**@type {string?}*/ #description;
	/**@type {Array<EmbedFieldData>?}*/ #fields;
	/**@type {FooterData?}*/ #footer;
	/**@type {string?}*/ #imageUrl;
	/**@type {string?}*/ #thumbUrl;
	/**@type {(Date | number)?}*/ #timestamp;
	/**@type {string?}*/ #title;
	/**@type {string?}*/ #url;

	constructor() {
		this.#author = null;
		this.#color = null;
		this.#description = null;
		this.#fields = null;
		this.#footer = null;
		this.#imageUrl = null;
		this.#thumbUrl = null;
		this.#timestamp = null;
		this.#title = null;
		this.#url = null;
	}

	/**
	 * Hard-copies the supplied data into an EmbedData instance
	 * @param {EmbedResolvable} data 
	 */
	static from(data) {
		const embed = new EmbedData();

		embed.#color = data.color;
		embed.#description = data.description;
		embed.#imageUrl = data.imageUrl;
		embed.#thumbUrl = data.thumbUrl;
		embed.#timestamp = data.timestamp;
		embed.#title = data.title;
		embed.#url = data.url;

		if(data.author) {
			const { name, iconUrl, url } = data.author;
			embed.#author = { name, iconUrl, url };
		}

		if(data.fields?.length)
			embed.#fields = JSON.parse(JSON.stringify(data.fields));

		if(data.footer) {
			const { text, iconUrl } = data.footer;
			embed.#footer = { text, iconUrl };
		}

		return embed;
	}

	/**Returns a hard-copy of this instance*/
	copy() {
		return EmbedData.from(this.data);
	}

	/**
	 * @param {AuthorData?} options 
	 */
	setAuthor(options) {
		expectNonEmptyString(options?.name);
		options?.url && expectUrl(options?.url);
		options?.iconUrl && expectUrl(options?.iconUrl);

		this.#author = options;
		return this;
	}

	/**
	 * @param {ColorResolvable?} color 
	 */
	setColor(color) {
		if(color == null) {
			this.#color = null;
			return this;
		}

		if(typeof color === 'number') {
			if(color < 0x000000 || color > 0xffffff)
				throw new RangeError(`Invalid color value: ${color}`);

			this.#color = color;
			return this;
		}

		if(typeof color !== 'string')
			throw TypeError(`Invalid color type: ${typeof color}`);

		if(!color.startsWith('#'))
			throw RangeError(`Color hex string should begin with "#". Received: ${color}`);

		const match = color.match(/^#([0-9a-f]{1,6})$/i);
		if(!match)
			throw TypeError(`Invalid color hex format: ${color}`);

		this.#color = color;
		return this;
	}

	/**
	 * @param {string?} description 
	 */
	setDescription(description) {
		description != null && expectNonEmptyString(description);
		this.#description = description;

		return this;
	}

	/**
	 * @param  {Array<EmbedFieldData>?} fields 
	 */
	setFields(fields) {
		this.#fields = fields;
		return this;
	}

	/**
	 * @param {FooterData?} options 
	 */
	setFooter(options) {
		if(!options) {
			this.#footer = null;
			return this;
		}

		options.iconUrl && expectUrl(options.iconUrl);
		expectNonEmptyString(options.text);
		this.#footer = options;

		return this;
	}

	/**
	 * @param {string?} url 
	 */
	setImage(url) {
		url != null && expectUrl(url);
		this.#imageUrl = url;

		return this;
	}

	/**
	 * @param {string?} url 
	 */
	setThumbnail(url) {
		url != null && expectUrl(url);
		this.#thumbUrl = url;

		return this;
	}

	/**
	 * @param {(Date | number)?} timestamp
	 */
	setTimestamp(timestamp) {
		this.#timestamp = timestamp;
		return this;
	}

	/**
	 * @param {string?} title 
	 */
	setTitle(title) {
		title != null && expectNonEmptyString(title);
		this.#title = title;

		return this;
	}

	/**
	 * @param {string?} url 
	 */
	setUrl(url) {
		url != null && expectUrl(url);
		this.#url = url;

		return this;
	}

	/**
	 * @param  {...EmbedFieldData} fields 
	 */
	addFields(...fields) {
		this.#fields ??= [];
		this.#fields.push(...fields);
		return this;
	}

	get empty() {
		return !this.#author?.name
			&& !this.#description
			&& !this.#fields?.length
			&& !this.#footer?.text
			&& !this.#imageUrl
			&& !this.#thumbUrl
			&& !this.#title;
	}

	get data() {
		return /**@type {EmbedResolvable}*/({
			author: this.#author,
			color: this.#color,
			description: this.#description,
			fields: this.#fields,
			footer: this.#footer,
			imageUrl: this.#imageUrl,
			thumbUrl: this.#thumbUrl,
			timestamp: this.#timestamp,
			title: this.#title,
			url: this.#url,
		});
	}

	hardCopiedData() {
		return /**@type {EmbedResolvable}*/(JSON.parse(JSON.stringify(this.data)));
	}

	toString() {
		return JSON.stringify(this.data);
	}

	get [Symbol.toStringTag]() {
		return this.toString();
	}
}

/**
 * @param {*} str
 * @throws
 */
function expectNonEmptyString(str) {
	if(typeof str !== 'string' || str.length === 0)
		throw `The value must be a non-empty string. Received: ${str}`;
}

/**
 * @param {string} url
 * @throws
 */
function expectUrl(url) {
	new URL(url.trim());
}

module.exports = {
	EmbedData,
};
