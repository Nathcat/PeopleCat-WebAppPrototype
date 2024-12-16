import globalImg from "$lib/assets/global.png";
import { fetchUser } from "./authcat";

export interface Message {
	/** The chat id this message belongs to */
	chatId: number;
	/** The text content of this message */
	content: string;
	/** The user ID of this message's author */
	senderId: number;
	/** The unix timestamp this message was sent at */
	timeSent: number;
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

export interface Chat {
	id: number;
	name: string;
	icon: string;
}

/**
 * Helper class for caching data recieved from the PeopleCat server
 */
export class ApplicationCache {
	public messages: Record<number, Message[]> = $state({});
	private users: Record<number, Promise<User>> = {};
	public chats: Record<number, Chat> = $state({
		1: { id: 1, name: "Global Chat", icon: globalImg },
	});

	/**
	 * Add a message to the message cache
	 * @param message The {@link Message} object
	 */
	public pushMessage(message: Message) {
		// todo: sort messages
		if (!(message.chatId in this.messages)) this.messages[message.chatId] = [];
		this.messages[message.chatId].push(message);
	}

	/**
	 * Add a user to the user cache
	 * @param user The {@link User} object
	 */
	public pushUser(user: User) {
		this.users[user.id] = new Promise((r) => r(user));
	}

	/**
	 * Get a {@link User} object by their user ID
	 *
	 * If cache miss, data is fetched from AuthCat
	 * @param id The ID of the user to fetch
	 * @returns A promise that resolves to a {@link User}
	 */
	public getUser(id: number) {
		if (!(id in this.users))
			// Create a promise that resolves when the user has been fetched
			this.users[id] = new Promise((r) => fetchUser(id).then((u) => r(u)));
		return this.users[id];
	}
}
