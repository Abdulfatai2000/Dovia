import nodemailer from "nodemailer";

import { serverEnv } from "@/lib/env.server";

const fromAddress = serverEnv.EMAIL_FROM_ADDRESS || serverEnv.SMTP_USER;

export const mailer = nodemailer.createTransport({
  host: serverEnv.SMTP_HOST,
  port: serverEnv.SMTP_PORT,
  secure: serverEnv.SMTP_PORT === 465,
  auth: {
    user: serverEnv.SMTP_USER,
    pass: serverEnv.SMTP_APP_PASSWORD,
  },
});

export function buildFrom() {
  return `${serverEnv.EMAIL_FROM_NAME} <${fromAddress}>`;
}

export function verifyMailerConnection() {
  return mailer.verify();
}
