// convex/auth.config.ts
import { AuthConfig } from "convex/server";

export default {
  providers: [
    {
      type: "customJwt",
      issuer: process.env.BETTER_AUTH_URL!,
      jwks: `${process.env.BETTER_AUTH_URL}/.well-known/jwks.json`,
      applicationID: "convex",
      algorithm: "RS256",
    },
  ],
} satisfies AuthConfig;
