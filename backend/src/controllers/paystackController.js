import paystack from "paystack-api"; // Paystack API client
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const paystackClient = paystack(process.env.PAYSTACK_SECRET_KEY); // Use secret key from Paystack dashboard

export const initiatePayment = async (req, res) => {
    try {
        const { email, amount } = req.body;

        const paymentResponse = await paystackClient.transaction.initialize({
            email,
            amount: amount * 100, // Convert to kobo
            callback_url: "http://localhost:3000/payment-success",
        });

        res.json({ authorizationUrl: paymentResponse.data.authorization_url });
    } catch (error) {
        console.error("Error initiating payment:", error);
        res.status(500).json({ error: "Payment initiation failed" });
    }
};
