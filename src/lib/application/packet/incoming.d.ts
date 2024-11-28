import type { Message, User } from "../cache.svelte";
import type { Packet, PacketType } from ".";

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
			PacketType.GET_MESSAGE_QUEUE,
			| {
					"message-count": number;
			  }
			| ({
					ChatID: number;
			  } & Message)
	  >
	| Packet<
			PacketType.NOTIFICATION_MESSAGE,
			{
				title: string;
				message: string;
				ChatID: number;
				Message: Message;
			}
	  >;
