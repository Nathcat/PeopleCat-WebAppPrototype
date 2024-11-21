export interface Message {
	content: string;
	author: number;
	time: number;
}

/**
 * Helper class for caching data recieved from the PeopleCat server
 */
export class ApplicationCache {
	public messages: Record<number, Message[]> = $state({});

	/**
	 * Add a message to the message cache
	 * @param chat The ID of the chat this message belongs to
	 * @param message The {@link Message} object
	 */
	public add_message(chat: number, message: Message) {
		if (!(chat in this.messages)) this.messages[chat] = [];
		this.messages[chat].push(message);
	}
}
