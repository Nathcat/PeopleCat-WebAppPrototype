export type { IncomingPacket } from "./incoming";
export type { OutgoingPacket } from "./outgoing";
import ByteBuffer from "bytebuffer";

/** Map of `PacketType` to packet type ID, used when sending. */
export enum PacketType {
	ERROR = 0,
	AUTHENTICATE = 2,
}

/** Base payload all packets extend */
export interface Packet<T extends PacketType = any, P = any> {
	type: T;
	payload: P;
}

/**
 * Encode a packet into bytes
 * @param packet The {@link Packet} object to encode
 * @returns The encoded packet
 */
export function encode(packet: Packet): Uint8Array {
	const bb = new ByteBuffer()
		.writeUint32(packet.type)
		.writeUint8(1)
		.writeIString(JSON.stringify(packet.payload));
	return bb.buffer;
}

/**
 * Decode a packet from bytes
 * @param buffer the encoded packet
 * @returns The decoded {@link Packet} object
 */
export function decode(buffer: Parameters<typeof ByteBuffer.wrap>[0]): Packet {
	const bb = ByteBuffer.wrap(buffer);
	const type: PacketType = bb.readUint32();
	const final = Boolean(bb.readUint8());
	const payload = JSON.parse(bb.readIString());
	return { type, payload };
}
