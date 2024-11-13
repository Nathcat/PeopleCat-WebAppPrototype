/** Map of `PacketType` to packet type ID, used when sending. */
export const PACKET_TYPES = Object.freeze({
	ERROR: 0,
	AUTHENTICATE: 2,
});

/** Packet types */
export type PacketType = keyof typeof PACKET_TYPES;

/** Base payload all packets extend */
export interface BasePacket<T extends PacketType> {
	/** The {@link PacketType} of this packet */
	type: T;
}

export interface OutgoingAuthenticatePacket extends BasePacket<"AUTHENTICATE"> {
	/** An authenticated AuthCat session cookie */
	"cookie-auth": string;
}

export interface IncomingAuthenticatePacket extends BasePacket<"AUTHENTICATE"> {
	/** The ID of the currently user */
	ID: number;

	/** The username of the current user */
	username: string;

	/** The display name of the current user */
	display_name: string;

	/** Timestamp of when the current user was created */
	time_created: number;

	/** The path to the current user's profile picture from `https://data.nathcat.net/pfps/` */
	pfp_path: string;

	/** @experimental */
	cover_pic_path: string;
}
