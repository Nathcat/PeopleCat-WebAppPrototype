/**
 * An implementation of the PeopleCat Packet class for JavaScript.
 * Allows JavaScript programs to decode and encode the binary packets received from / sent to the PeopleCat server
 * @author Nathan Baines
 * @link https://nathcat.github.io/PeopleCat-Server/com/nathcat/peoplecat_server/Packet.html
 */
class Packet {
    static TYPE_ERROR = 0;
    static TYPE_PING = 1;
    static TYPE_AUTHENTICATE = 2;
    static TYPE_CREATE_NEW_USER = 3;
    static TYPE_CLOSE = 4;
    static TYPE_GET_USER = 5;
    static TYPE_GET_MESSAGE_QUEUE = 6;
    static TYPE_SEND_MESSAGE = 7;
    static TYPE_NOTIFICATION_MESSAGE = 8;
    static TYPE_JOIN_CHAT = 9;
    static TYPE_CHANGE_PFP_PATH = 10;
    static TYPE_GET_ACTIVE_USER_COUNT = 11;

    /**
     * Read a packet from the given data
     * @param {Uint8Array} buffer
     * @param {Number} type
     * @param {isFinal} isFinal
     * @param {Uint8Array} payload
     */
    constructor(args) {
        if ("buffer" in args) {
            let buffer = args["buffer"];
            this.type = Packet.__read_int(buffer, 0);
            this.isFinal = Packet.__read_boolean(buffer, 4);
            let payloadLength = Packet.__read_int(buffer, 5);
            this.payload = payloadLength != 0 ? buffer.subarray(9, 9 + payloadLength) : new Uint8Array(0);
        }
        else if ("type" in args && "isFinal" in args && "payload" in args) {
            this.type = args["type"];
            this.isFinal = args["isFinal"];
            this.payload = args["payload"];
        }
        else if ("type" in args && "isFinal" in args && "object" in args) {
            this.type = args["type"];
            this.isFinal = args["isFinal"];
            let enc = new TextEncoder();
            this.payload = enc.encode(JSON.stringify(args["object"]));
        }
        else if ("type" in args && "isFinal" in args) {
            this.type = args["type"];
            this.isFinal = args["isFinal"];
            this.payload = new Uint8Array(0);
        }
        else {
            throw new Error("Invalid argument combination supplied. Please specify any of the following combinations:\nbuffer\ntype, isFinal, payload\ntype, isFinal, object\ntype, isFinal");
        }
    }

    /**
     * Read a 32 bit integer from the buffer at the specified position
     * @param {Uint8Array} buffer
     * @param {Number} position
     * @returns {Number} The value read from the buffer
     */
    static __read_int(buffer, position) {
        let n = 0;
        n |= (buffer[position] << 24);
        n |= (buffer[position + 1] << 16);
        n |= (buffer[position + 2] << 8);
        n |= buffer[position + 3];
        return n;
    }

    /**
     * Write a 32 bit integer to a buffer at the specified position
     * @param {Uint8Array} buffer 
     * @param {Number} position 
     * @param {Number} n 
     */
    static __write_int(buffer, position, n) {
        buffer[position] = (n >> 24) & 255;
        buffer[position + 1] = (n >> 16) & 255;
        buffer[position + 2] = (n >> 8) & 255;
        buffer[position + 3] = n & 255;
    }

    /**
     * Read a boolean value from the buffer
     * @param {Uint8Array} buffer 
     * @param {Number} position 
     * @returns The boolean read from the stream
     */
    static __read_boolean(buffer, position) {
        return buffer[position] == 1;
    }

    /**
     * Write a boolean to a buffer at the specified position
     * @param {Uint8Array} buffer 
     * @param {Number} position 
     * @param {Boolean} n 
     */
    static __write_boolean(buffer, position, n) {
        buffer[position] = n ? 1 : 0;
    }

    /**
     * Copy the contents of buffer b into buffer a.
     * @param {Uint8Array} a 
     * @param {Number} startA The position to copy into in a
     * @param {Uint8Array} b 
     * @param {Number} startB The position to copy from in b
     * @param {Number} n The number of elements to copy
     */
    static __write_buffer(a, startA, b, startB, n) {
        for (let i = 0; i < n; i++) {
            a[startA + i] = b[startB + i];
        }
    }

    /**
     * Get the bytes of this packet
     * @returns {Uint8Array} The bytes of this packet
     */
    getBytes() {
        let a = new Uint8Array(9 + this.payload.length);
        Packet.__write_int(a, 0, this.type);
        Packet.__write_boolean(a, 4, this.isFinal);
        Packet.__write_int(a, 5, this.payload.length);
        Packet.__write_buffer(a, 9, this.payload, 0, this.payload.length);
        return a;
    }

    /**
     * Decode the data from the payload of this packet
     * @returns {Object} The payload object attached to this packet
     */
    getData() {
        let dec = new TextDecoder();
        return JSON.parse(dec.decode(this.payload));
    }

    /**
     * @see https://nathcat.github.io/PeopleCat-Server/com/nathcat/peoplecat_server/Packet.html#createClose()
     * @returns {Packet}
     */
    static createClose() {
        return new Packet({
            "type": Packet.TYPE_CLOSE, 
            "isFinal": true
        });
    }

    /**
     * @see https://nathcat.github.io/PeopleCat-Server/com/nathcat/peoplecat_server/Packet.html#createPing()
     * @returns {Packet}
     */
    static createPing() {
        return new Packet({
            "type": Packet.TYPE_PING,
            "isFinal": true
        });
    }

    /**
     * @see https://nathcat.github.io/PeopleCat-Server/com/nathcat/peoplecat_server/Packet.html#createError(java.lang.String,java.lang.String)
     * @param {String} name 
     * @param {String} msg 
     * @returns {Packet}
     */
    static createError(name, msg) {
        let enc = new TextEncoder();
        let payload = enc.encode(
            JSON.stringify({
                "name": name,
                "msg": msg
            })
        );

        return new Packet({
            "type": Packet.TYPE_ERROR,
            "isFinal": true,
            "payload": payload
        });
    }
};