import { PaystackButton } from "react-paystack";

const PaymentButton = ({ email, amount }) => {
    const config = {
        reference: new Date().getTime().toString(),
        email,
        amount: amount * 100, // Convert to kobo
        publicKey: "869965", // Paystack public key
        onSuccess: (response) => {
            console.log("Payment successful:", response);
        },
        onClose: () => {
            console.log("Payment closed.");
        },
    };

    return <PaystackButton {...config} className="pay-button" />;
};

