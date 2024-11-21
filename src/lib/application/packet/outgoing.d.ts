import type { Packet, PacketType } from ".";

export type OutgoingPacket =
	| Packet<
			PacketType.ERROR,
			{
				name: string;
				msg: string;
			}
	  >
	| Packet<
			PacketType.AUTHENTICATE,
			{
				/** An authenticated AuthCat session cookie */
				"cookie-auth": string;
			}
	  >
	| Packet<
			PacketType.TYPE_GET_MESSAGE_QUEUE,
			{
				ChatID: number;
			}
	  >;
