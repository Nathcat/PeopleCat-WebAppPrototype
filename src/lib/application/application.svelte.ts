import { encode, decode, type OutgoingPacket } from "./packet";
import { env } from "$env/dynamic/public";

export class Application {
	private socket: WebSocket | null = null;
	public ready = $state(false);

	public connect() {
		if (this.socket) throw new Error("Attempted to overwrite socket");

		this.socket = new WebSocket(env.PUBLIC_BACKEND_URL!);
		this.socket.addEventListener("message", (m) => this.recieve(m));
		this.socket.addEventListener("open", () => this.open());
		this.socket.addEventListener("error", (e) => {
			this.ready = false;
			this.socket = null;
			this.connect();
		});
	}

	private open() {
		this.ready = true;
	}

	private async recieve(message: MessageEvent<Blob>) {
		const buffer = await message.data.arrayBuffer();
		console.log(decode(buffer));
	}

	public async send(packet: OutgoingPacket) {
		if (!this.ready) throw Error("Attempted to send on closed connection");
		return this.socket?.send(encode(packet));
	}
}
