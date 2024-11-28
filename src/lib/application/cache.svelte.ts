import { fetch_user } from "./authcat";

export interface Message {
	/** The text content of this message */
	content: string;
	/** The user ID of this message's author */
	author: number;
	/** The unix timestamp this message was sent at */
	time: Date;
}

export interface User {
	/** The ID of the currently user */
	id: number;
	/** The username of the current user */
	username: string;
	/** The display name of the current user */
	fullName: string;
	/** The path to the current user's profile picture from `https://data.nathcat.net/pfps` */
	pfpPath: string;
}

/**
 * Helper class for caching data recieved from the PeopleCat server
 */
export class ApplicationCache {
	public messages: Record<number, Message[]> = $state({});
	private users: Record<number, Promise<User>> = {};

	/**
	 * Add a message to the message cache
	 * @param chat The ID of the chat this message belongs to
	 * @param message The {@link Message} object
	 */
	public push_message(chat: number, message: Message) {
		if (!(chat in this.messages)) this.messages[chat] = [];
		this.messages[chat].push(message);
	}

	/**
	 * Add a user to the user cache
	 * @param user The {@link User} object
	 */
	public push_user(user: User) {
		this.users[user.id] = new Promise((r) => r(user));
	}

	/**
	 * Fetch a {@link User} object from AuthCat by their user ID
	 * @param id The ID of the user to fetch
	 * @returns A promise that resolves to a {@link User}
	 */
	public fetch_user(id: number) {
		if (!(id in this.users))
			// Create a promise that resolves when the user has been fetched
			this.users[id] = new Promise((r) => fetch_user(id).then((u) => r(u)));
		return this.users[id];
	}
}
