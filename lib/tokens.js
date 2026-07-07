import crypto from "crypto";

export function generateToken() {
  return crypto.randomBytes(32).toString("hex");
}

export function hoursFromNow(hours) {
  return new Date(Date.now() + hours * 60 * 60 * 1000);
}
