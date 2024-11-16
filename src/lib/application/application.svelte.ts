import { env } from "$env/dynamic/public";
import { goto } from "$app/navigation";
import { page } from "$app/stores";
import { get } from "svelte/store";
import * as cookie from "cookie";
import {
	type IncomingPacket,
	type OutgoingPacket,
	type Packet,
	PacketType,
	decode,
	encode,
} from "./packet";

export class Application {
	private socket: WebSocket | null = null;
	private ready: boolean = false;
	public loaded = $state(false);

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
			this.connect();
		});
	}

	/** Recieve and handle packet from the PeopleCat backend */
	private async recieve(message: MessageEvent<Blob>) {
		const buffer = await message.data.arrayBuffer();
		const packet = decode(buffer);

		this.waiting[packet.type].forEach(({ resolve }) => resolve(packet));
		this.waiting[packet.type] = [];
	}

	/** Send a packet to the PeopleCat backend */
	public async send(packet: OutgoingPacket) {
		if (!this.ready) throw Error("Attempted to send on unready connection");
		return this.socket?.send(encode(packet));
	}

	/** Authenticate with the PeopleCat backend or prompt the user to Login */
	public async authenticate() {
		const session = cookie.parse(document.cookie)["AuthCat-SSO"];
		if (session) {
			await this.send({ type: PacketType.AUTHENTICATE, payload: { "cookie-auth": session } });
			const response = await Promise.any([
				this.wait_for(PacketType.AUTHENTICATE),
				this.wait_for(PacketType.ERROR),
			]);

			if (response.type == PacketType.AUTHENTICATE) {
				return;
			}
		}

		// Log in
		const url = get(page).url;
		if (url.host.endsWith(env.PUBLIC_AUTHCAT_DOMAIN)) {
			const l = `${env.PUBLIC_AUTHCAT_URL}?return-page=${encodeURIComponent(url.href)}`;
			window.location.assign(l);
		} else goto("/login");
	}

	/**
	 * Wait for the next instance of {@link PacketType} to be recieved
	 * @param type The type of packet to wait for
	 * @returns A promise for the specified packet type
	 */
	public wait_for<T extends PacketType>(type: T): Promise<Extract<IncomingPacket, Packet<T>>> {
		// @ts-ignore
		return new Promise<Packet>((resolve, reject) => {
			this.waiting[type].push({ resolve, reject });
		});
	}
}
