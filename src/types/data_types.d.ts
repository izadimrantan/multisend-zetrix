type RecipientInfo = {
    recipient: string;
    amount: string;
    tokenId?: string;
}

type RecipientGroup = {
    recipients: string[];
    tokenId: string;
    totalAmount: number;
}