import { addToast } from "$lib/components/toast/Toaster.svelte";
import { ApplicationCache, type User } from "./cache.svelte";
import { env } from "$env/dynamic/public";
import { goto } from "$app/navigation";
import {
	type IncomingPacket,
	type OutgoingPacket,
	type Packet,
	PacketType,
	decode,
	encode,
} from "./packet";
import { getCookie, isCORS } from "./authcat";

/**
 * Represents an instance of the application.
 *
 * Contains shared applciation data and functions.
 */
export class Application {
	public cache = new ApplicationCache();
	public user: null | User = null;
	public loaded = $state(false);

	private socket: WebSocket | null = null;
	private ready: boolean = false;

	/** A map of all currently pending wait operations */
	private waiting = Object.values(PacketType)
		.filter((k) => typeof k == "number")
		.reduce((p, c) => ({ ...p, [c]: [] }), {}) as Record<
		PacketType,
		{ resolve: (value: Packet) => void; reject: (reason: any) => void }[]
	>;

	/** Connect and authenticate with the PeopleCat backend */
	public connect() {
		if (this.socket) throw new Error("Attempted to overwrite socket");

		this.socket = new WebSocket(env.PUBLIC_BACKEND_URL!);
		this.socket.addEventListener("message", (m) => this.recieve(m));

		this.socket.addEventListener("open", async () => {
			this.ready = true;
			await this.authenticate();
			this.loaded = true;
		});

		this.socket.addEventListener("error", (e) => {
			// Cancel all
			Object.values(this.waiting)
				.flat()
				.forEach(({ reject }) => reject(e));

			this.loaded = false;
			this.socket = null;
			this.ready = false;
			this.user = null;
			this.connect();
		});
	}

	/** Recieve and handle packet from the PeopleCat backend */
	private async recieve(message: MessageEvent<Blob>) {
		const buffer = await message.data.arrayBuffer();
		const packet = decode(buffer) as IncomingPacket;

		switch (packet.type) {
			case PacketType.ERROR:
				console.error(packet.payload);
				addToast({
					type: "error",
					title: packet.payload.name,
					description: packet.payload.msg,
				});
				break;
			case PacketType.GET_MESSAGE_QUEUE:
				if ("message-count" in packet.payload) break;
				this.cache.pushMessage(packet.payload);

				break;
			case PacketType.NOTIFICATION_MESSAGE:
				this.cache.pushMessage(packet.payload.message);
				break;
		}

		this.waiting[packet.type]?.forEach(({ resolve }) => resolve(packet));
		this.waiting[packet.type] = [];
	}

	/** Send a packet to the PeopleCat backend */
	public async send(packet: OutgoingPacket) {
		if (!this.ready) throw Error("Attempted to send on unready connection");
		return this.socket?.send(encode(packet));
	}

	/** Authenticate with the PeopleCat backend or prompt the user to Login */
	public async authenticate() {
		const session = getCookie();

		if (session) {
			await this.send({ type: PacketType.AUTHENTICATE, payload: { cookieAuth: session } });
			const response = await Promise.any([
				this.waitFor(PacketType.AUTHENTICATE),
				this.waitFor(PacketType.ERROR),
			]);

			if (response.type == PacketType.AUTHENTICATE) {
				this.cache.pushUser(response.payload);
				this.user = response.payload;
				return;
			}
		}

		// Log in
		const search = `return-page=${encodeURIComponent(window.location.href)}`;
		if (isCORS()) await goto(`/login?${search}`);
		else {
			const l = `${env.PUBLIC_AUTHCAT_URL}?${search}`;
			window.location.assign(l);
		}
	}

	/**
	 * Wait for the next instance of {@link PacketType} to be recieved
	 * @param type The type of packet to wait for
	 * @returns A promise for the specified packet type
	 */
	public waitFor<T extends PacketType>(type: T): Promise<Extract<IncomingPacket, Packet<T>>> {
		// @ts-ignore
		return new Promise<Packet>((resolve, reject) => {
			this.waiting[type].push({ resolve, reject });
		});
	}
}
