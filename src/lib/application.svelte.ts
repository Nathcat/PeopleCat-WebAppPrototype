import { env } from "$env/dynamic/public";

export class Application {
	socket: WebSocket | null = null;
	ready = $state(false);

	connect() {
		if (this.socket) throw new Error("Attempted to overwrite socket");

		this.socket = new WebSocket(env.PUBLIC_BACKEND_URL!);
		this.socket.addEventListener("open", () => (this.ready = true));
		this.socket.addEventListener("error", () => {
			this.ready = false;
			this.socket = null;
			this.connect();
		});
	}
}
