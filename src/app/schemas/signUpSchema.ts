import {z} from 'zod';

export const usernameValidation = z
    .string()
    .min(2, "username must be atleast 2 characters")
    .max(20, "username must be atmost 20 charcters")
    .regex(/^[a-zA-Z0-9]+$/,"username must not contain special characters")

export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.email({message:"Invalid email address"}),
    password: z.string().min(6,{message:"Password should be atleast of 6 characters"})
})