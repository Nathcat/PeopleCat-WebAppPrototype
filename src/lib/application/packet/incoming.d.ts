import type { Packet, PacketType } from ".";
import type { User } from "../cache.svelte";

export type IncomingPacket =
	| Packet<
			PacketType.ERROR,
			{
				name: string;
				msg: string;
			}
	  >
	| Packet<PacketType.AUTHENTICATE, User>
	| Packet<
			PacketType.TYPE_GET_MESSAGE_QUEUE,
			| {
					"message-count": number;
			  }
			| {
					ChatID: number;
					Content: string;
					SenderID: number;
					TimeSent: number;
			  }
	  >;
