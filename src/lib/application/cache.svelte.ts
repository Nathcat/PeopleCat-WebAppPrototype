import type { Message, User } from "./peoplecat";
import globalImg from "$lib/assets/global.png";
import { fetchUser } from "./authcat";

export interface Chat {
	id: number;
	name: string;
	icon: string;
}

export class CacheContainer<T> {
	private loader: (id: number) => Promise<T>;
	private _store = $state<Record<number, T>>({});
	private _fetched = $state<number[]>([]);
	private _tasks: Record<number, Promise<T>> = [];

	constructor(loader: (id: number) => Promise<T>) {
		this.loader = loader;
	}

	get(id: number) {
		if (id in this._tasks) this.fetch(id);
		return this._store[id] as T | undefined;
	}

	async fetch(id: number) {
		if (!(id in this._tasks))
			this._tasks[id] = this.loader(id).then((v) => {
				this._fetched.push(id);
				this.set(id, v);
				return v;
			});
		return this._tasks[id];
	}

	fetched(id: number) {
		return this._fetched.includes(id);
	}

	set(id: number, value: T) {
		this._store[id] = value;
	}
}

namespace Cache {
	export const users = new CacheContainer<User>(async (id) => await fetchUser(id));
}

export default Cache;

/**
 * Helper class for caching data recieved from the PeopleCat server
 */
export class ApplicationCache {
	public messages: Record<number, Message[]> = $state({});
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
}
