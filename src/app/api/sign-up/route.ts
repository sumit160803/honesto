import dbConnect from "@/lib/DbConnect";
import UserModel from "@/model/user";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helper/sendVerificationEmail";

export async function POST(request: Request) {
    await dbConnect();
    try {
        const { email, password, username } = await request.json();
        const existingUserVerifiedByEmail = await UserModel.findOne({
            username,
            isVerified: true,
        })
        if( existingUserVerifiedByEmail ) {
            return Response.json(
                {
                    success: false,
                    message: "Username already exists. Please choose a different username.",
                },
                {
                    status: 400,
                }
            );
        }
        const existingUserByEmail = await UserModel.findOne({email});
        let verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                return Response.json(
                {
                    success: false,
                    message: 'User already exists with this email',
                },
                { status: 400 }
                );
            } else {
                const hashedPassword = await bcrypt.hash(password, 10);
                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
                await existingUserByEmail.save();
            }
        }
        else{
            const hashedPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);

            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessages: true,
                messages: [],
            });

        await newUser.save();
        }

        const emailResponse = await sendVerificationEmail(
        email,
        username,
        verifyCode
        );
        if (!emailResponse.success) {
        return Response.json(
            {
            success: false,
            message: emailResponse.message,
            },
            { status: 500 }
        );
        }

        return Response.json(
        {
            success: true,
            message: 'User registered successfully. Please verify your account.',
        },
        { status: 201 }
        );

    } catch (error) {
        console.error("Error in sign-up route:", error);
        return Response.json(
            {
            success: false,
            message: "An error occurred during sign-up. Please try again later.",
            },
            {
            status: 500,
            }
        )
    }
}