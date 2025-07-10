import z from "zod";

export const verifySchema = z.object({
    code: z.length(6,'verification code should be of 6 length')
})