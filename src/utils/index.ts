const base32chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

export function base32ToBytes(base32: string): Uint8Array {
    let bits = "";
    let bytes = [];
    base32 = base32.replace(/=+$/, "");
    for (let i = 0; i < base32.length; i++) {
        let val = base32chars.indexOf(base32.charAt(i).toUpperCase());
        bits += val.toString(2).padStart(5, "0");
    }
    for (let i = 0; i + 8 <= bits.length; i += 8) {
        bytes.push(parseInt(bits.substring(i, i + 8), 2));
    }
    return new Uint8Array(bytes);
}

export function intToBytes(num: number): ArrayBuffer {
    const buffer = new ArrayBuffer(8);
    const view = new DataView(buffer);
    view.setUint32(4, num);
    return buffer;
}

export async function generateTOTP(secretBase32: string, digits = 6, step = 30) {
    const keyBytes = base32ToBytes(secretBase32);
    const counter = Math.floor(Date.now() / 1000 / step);
    const counterBytes = intToBytes(counter);

    const key = await crypto.subtle.importKey(
        "raw",
        keyBytes as any,
        { name: "HMAC", hash: "SHA-1" },
        false,
        ["sign"]
    );

    const hmac = await crypto.subtle.sign("HMAC", key, counterBytes);
    const hmacBytes = new Uint8Array(hmac);

    const offset = hmacBytes[hmacBytes.length - 1] & 0xf;
    const binary =
        ((hmacBytes[offset] & 0x7f) << 24) |
        ((hmacBytes[offset + 1] & 0xff) << 16) |
        ((hmacBytes[offset + 2] & 0xff) << 8) |
        (hmacBytes[offset + 3] & 0xff);

    const otp = binary % 10 ** digits;
    return otp.toString().padStart(digits, "0");
}