export const simulateDelay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function sendOtp(phone: string): Promise<{ success: boolean; error?: string }> {
    await simulateDelay(1500);
    if (phone.length < 10) return { success: false, error: "Invalid phone number" };
    return { success: true };
}

export async function verifyOtp(code: string): Promise<{ success: boolean; error?: string }> {
    await simulateDelay(1500);
    if (code === "123456") return { success: true };
    return { success: false, error: "Invalid verification code" };
}
