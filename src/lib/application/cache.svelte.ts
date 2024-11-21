export interface Message {
	content: string;
	author: number;
	time: number;
}

export class ApplicationCache {
	public messages: Record<number, Message[]> = $state({});

	public add_message(chat: number, message: Message) {
		if (!(chat in this.messages)) this.messages[chat] = [];
		this.messages[chat].push(message);
	}
}
