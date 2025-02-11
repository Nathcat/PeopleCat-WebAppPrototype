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
