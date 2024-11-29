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
			| Message
	  >
	| Packet<
			PacketType.NOTIFICATION_MESSAGE,
			{
				chatId: number;
				message: Message;
			}
	  >;
