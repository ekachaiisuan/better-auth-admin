import { createAuthClient } from "better-auth/react"
import { twoFactor } from "better-auth/plugins/two-factor"
export const authClient = createAuthClient({
    plugins: [twoFactor()],
})