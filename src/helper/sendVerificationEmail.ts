import { resend } from "../lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "../types/apiResponse";

export async function sendVerificationEmail(
    email: string,
    verifyCode: string,
    username: string
): Promise<ApiResponse> {
    try {

        await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: 'Please verify your email address for Honesto',
        react: VerificationEmail({username, otp: verifyCode}),
        });

        return {
            success: true,
            message: "Verification email sent successfully.",
        }
    } catch (error) {
        console.error("Error sending verification email:", error);
        return {
            success: false,
            message: "Failed to send verification email. Please try again later.",
        }
    }
}