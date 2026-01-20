import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use true for port 465, false for port 587
  auth: {
    user: process.env.APP_USER,
    pass: process.env.APP_PASSWORD,
  },
});

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  baseURL: process.env.BETTER_AUTH_URL,
  trustedOrigins: [
    process.env.APP_URL!,
    "http://localhost:3000",
    "http://localhost:4000",
    "http://localhost:5000", // Allow self-requests
  ],
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "USER",
        required: false,
      },
      phone: {
        type: "string",
        required: false,
      },
      status: {
        type: "string",
        defaultValue: "ACTIVE",
        required: false,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requiredEmailVerification: true,
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      try {
        const verificationUrl = `${process.env.APP_URL}/verify-email?token=${token}`;
        const info = await transporter.sendMail({
          from: `"Prisma blog" <${process.env.APP_USER}>`,
          to: user.email,
          subject: "Hello ✔",
          text: `Verify your email by clicking this link: ${url}`, // Plain-text version of the message
          html: `<!DOCTYPE html>
          <html lang="en">
            <head>
              <meta charset="UTF-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <title>Email Verification</title>
            </head>
            <body
              style="
                margin: 0;
                padding: 0;
                background-color: #f4f6f8;
                font-family: Arial, Helvetica, sans-serif;
              "
            >
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding: 40px 0">
                    <table
                      width="100%"
                      max-width="600"
                      cellpadding="0"
                      cellspacing="0"
                      style="
                        background-color: #ffffff;
                        border-radius: 8px;
                        overflow: hidden;
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                      "
                    >
                      <!-- Header -->
                      <tr>
                        <td
                          style="
                            background-color: #4f46e5;
                            padding: 20px;
                            text-align: center;
                            color: #ffffff;
                          "
                        >
                          <h1 style="margin: 0; font-size: 22px">Prisma Blog</h1>
                        </td>
                      </tr>
          
                      <!-- Body -->
                      <tr>
                        <td style="padding: 30px; color: #333333">
                          <h2 style="margin-top: 0">Verify your email address</h2>
                          <p style="font-size: 15px; line-height: 1.6">
                            Thank you for signing up! Please confirm your email address by
                            clicking the button below.
                          </p>
          
                          <div style="text-align: center; margin: 30px 0">
                            <a
                              href="${verificationUrl}"
                              style="
                                background-color: #4f46e5;
                                color: #ffffff;
                                padding: 12px 24px;
                                text-decoration: none;
                                border-radius: 6px;
                                font-size: 16px;
                                display: inline-block;
                              "
                            >
                              Verify Email
                            </a>
                          </div>
          
                          <p style="font-size: 14px; color: #555555">
                            If the button doesn’t work, copy and paste the following link
                            into your browser:
                          </p>
          
                          <p
                            style="
                              font-size: 14px;
                              word-break: break-all;
                              color: #4f46e5;
                            "
                          >
                            <a href="${verificationUrl}" style="color: #4f46e5">
                              ${verificationUrl}
                            </a>
                          </p>
          
                          <p style="font-size: 14px; color: #777777">
                            If you did not create an account, you can safely ignore this
                            email.
                          </p>
                        </td>
                      </tr>
          
                      <!-- Footer -->
                      <tr>
                        <td
                          style="
                            padding: 20px;
                            text-align: center;
                            font-size: 12px;
                            color: #999999;
                            background-color: #f9fafb;
                          "
                        >
                          © 2026 Prisma Blog. All rights reserved.
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </body>
          </html>
          `, // HTML version of the message
        });
        console.log("Message sent:", info.messageId);
      } catch (error) {
        console.error("Error sending email:", error);
      }
    },
  },

  socialProviders: {
    google: {
      prompt: "select_account consent",
      accessType: "offline",
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
});
