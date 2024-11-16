import type { Packet, PacketType } from ".";

export type IncomingPacket =
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
				/** The ID of the currently user */
				id: number;
				/** The username of the current user */
				username: string;
				/** The display name of the current user */
				display_name: string;
				/** Timestamp of when the current user was created */
				time_created: number;
				/** The path to the current user's profile picture from `https://data.nathcat.net/pfps` */
				pfp_path: string;
			}
	  >;
