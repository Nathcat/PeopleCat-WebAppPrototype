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
	  >;
