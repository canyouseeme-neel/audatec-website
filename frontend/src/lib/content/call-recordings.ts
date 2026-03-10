export type TranscriptUtterance = {
    speaker: "agent" | "customer";
    text: string;
    startTime: number;
    endTime: number;
};

export type CallRecording = {
    id: string;
    scenario: string;
    label: string;
    durationLabel: string;
    outcome: string;
    outcomePositive: boolean;
    audioSrc: string;
    transcript: TranscriptUtterance[];
    followUp?: {
        label: string;
        durationLabel: string;
        outcome: string;
        outcomePositive: boolean;
        audioSrc: string;
        transcript: TranscriptUtterance[];
    };
};

export const callRecordings: CallRecording[] = [
    {
        id: "sales-home-loan",
        scenario: "sales",
        label: "Home Loan Cross-Sell — Inbound Lead",
        durationLabel: "2:15",
        outcome: "Qualified Lead",
        outcomePositive: true,
        audioSrc: "/audio/sales-home-loan.mp3",
        transcript: [
            {
                speaker: "agent",
                text: "Good morning! Thank you for calling Audatec Financial Services. My name is Anika, your AI Relationship Manager. How can I help you today?",
                startTime: 0,
                endTime: 8,
            },
            {
                speaker: "customer",
                text: "Hi, I was looking at your home loan options. I'm interested in something around 50 lakhs.",
                startTime: 9,
                endTime: 15,
            },
            {
                speaker: "agent",
                text: "Great choice! For a 50 lakh home loan, our current interest rate starts at 8.5% APR with a 20-year tenure option. There's a one-time processing fee of ₹10,000.",
                startTime: 16,
                endTime: 28,
            },
            {
                speaker: "customer",
                text: "That sounds reasonable. What about the lock-in period?",
                startTime: 29,
                endTime: 33,
            },
            {
                speaker: "agent",
                text: "There's a 12-month lock-in period. After that, you can prepay or foreclose without any penalty. I should also mention that by proceeding, you give consent for us to process your application and run a credit check. Would you like to proceed?",
                startTime: 34,
                endTime: 50,
            },
            {
                speaker: "customer",
                text: "Yes, sounds good. Let's proceed with the application.",
                startTime: 51,
                endTime: 55,
            },
            {
                speaker: "agent",
                text: "Wonderful! I'll share the KYC documents link on your registered email. The next step is document verification, which typically takes 2-3 business days. Thank you for choosing Audatec!",
                startTime: 56,
                endTime: 68,
            },
        ],
        followUp: {
            label: "Follow-up — Document Status",
            durationLabel: "1:30",
            outcome: "Application Submitted",
            outcomePositive: true,
            audioSrc: "/audio/sales-home-loan-followup.mp3",
            transcript: [
                {
                    speaker: "agent",
                    text: "Hello! This is Anika from Audatec. I'm following up on your home loan application from last week for ₹50 lakhs. Your KYC documents have been verified successfully.",
                    startTime: 0,
                    endTime: 12,
                },
                {
                    speaker: "customer",
                    text: "Oh great, that's quick! What's the next step?",
                    startTime: 13,
                    endTime: 17,
                },
                {
                    speaker: "agent",
                    text: "Your application is now in the final approval stage. We expect the sanction letter within 48 hours. I'll send you a confirmation once it's approved.",
                    startTime: 18,
                    endTime: 30,
                },
                {
                    speaker: "customer",
                    text: "Perfect, thank you for the update.",
                    startTime: 31,
                    endTime: 34,
                },
            ],
        },
    },
    {
        id: "support-dispute",
        scenario: "support",
        label: "Transaction Dispute — Inbound Call",
        durationLabel: "1:45",
        outcome: "Resolved",
        outcomePositive: true,
        audioSrc: "/audio/support-dispute.mp3",
        transcript: [
            {
                speaker: "agent",
                text: "Thank you for calling Audatec Support. I'm Kara, your AI support assistant. I can see you have a pending query about a recent transaction. How can I help?",
                startTime: 0,
                endTime: 10,
            },
            {
                speaker: "customer",
                text: "Yes, I see a charge of ₹4,500 that I didn't authorize. It was on March 3rd.",
                startTime: 11,
                endTime: 18,
            },
            {
                speaker: "agent",
                text: "I can see the transaction from March 3rd for ₹4,500 at 'QuickMart Online'. I've flagged this as a disputed transaction and temporarily blocked the merchant. A refund will be processed within 5-7 business days.",
                startTime: 19,
                endTime: 35,
            },
            {
                speaker: "customer",
                text: "That's a relief. Will I get a confirmation?",
                startTime: 36,
                endTime: 40,
            },
            {
                speaker: "agent",
                text: "Absolutely. You'll receive an SMS and email confirmation within the next hour. Your dispute reference number is DSP-20260303-847. Is there anything else I can help with?",
                startTime: 41,
                endTime: 55,
            },
            {
                speaker: "customer",
                text: "No, that's all. Thank you very much!",
                startTime: 56,
                endTime: 60,
            },
        ],
    },
    {
        id: "collections-overdue",
        scenario: "collections",
        label: "EMI Overdue — Outbound Follow-up",
        durationLabel: "1:50",
        outcome: "Payment Plan Agreed",
        outcomePositive: false,
        audioSrc: "/audio/collections-overdue.mp3",
        transcript: [
            {
                speaker: "agent",
                text: "Good afternoon. This is Ravi from Audatec Collections. I'm calling regarding your personal loan account ending in 7842. We noticed the EMI due on February 28th is still outstanding.",
                startTime: 0,
                endTime: 14,
            },
            {
                speaker: "customer",
                text: "Yes, I'm aware. I had some unexpected expenses this month. I'm not sure when I can pay.",
                startTime: 15,
                endTime: 23,
            },
            {
                speaker: "agent",
                text: "I understand, and I appreciate your honesty. Your outstanding amount is ₹12,400. We can offer a payment plan — either pay the full amount by March 15th, or split it into two installments of ₹6,200 each over the next two months.",
                startTime: 24,
                endTime: 42,
            },
            {
                speaker: "customer",
                text: "The two-installment option would work better for me. Is there a penalty?",
                startTime: 43,
                endTime: 49,
            },
            {
                speaker: "agent",
                text: "There's a nominal late fee of ₹250 that's already applied. With the payment plan, no additional penalty will be charged. Do I have your consent to set up this arrangement?",
                startTime: 50,
                endTime: 62,
            },
            {
                speaker: "customer",
                text: "Yes, let's go with the two-installment plan.",
                startTime: 63,
                endTime: 67,
            },
            {
                speaker: "agent",
                text: "Done. I've set up the payment plan. You'll receive a confirmation SMS shortly with the due dates. Thank you for your cooperation.",
                startTime: 68,
                endTime: 78,
            },
        ],
    },
];
