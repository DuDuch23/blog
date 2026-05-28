import { jwtDecode } from "jwt-decode";

const secret = process.env.JWT_SECRET ?? "change-this-secret-in-production";

export type JwtPayload = {
  id: number;
  email: string;
  pseudo: string;
  role: "BLOGGER" | "ADMIN";
  exp?: number;
  iat?: number;
};

async function sign(message: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return Buffer.from(sig).toString("base64url");
}

export async function signToken(payload: Omit<JwtPayload, "exp" | "iat">): Promise<string> {
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const body = Buffer.from(
    JSON.stringify({ ...payload, iat: Math.floor(Date.now() / 1000), exp: Math.floor(Date.now() / 1000) + 7 * 24 * 3600 })
  ).toString("base64url");
  const signature = await sign(`${header}.${body}`);
  return `${header}.${body}.${signature}`;
}

export function decodeToken(token: string): JwtPayload {
  return jwtDecode<JwtPayload>(token);
}
