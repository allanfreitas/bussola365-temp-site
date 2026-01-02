export class WhatsAppNumberFixer {
  public static adjustBrazilianNumber(phoneNumber: string | null | undefined): string {
    if (!phoneNumber || phoneNumber.trim() === "") {
      return phoneNumber ?? "";
    }

    // 1. Clean string: keep only digits
    let cleaned = phoneNumber.replace(/\D/g, "");

    // 2. Check if starts with 55 (Brazil)
    if (cleaned.startsWith("55")) {
      // Logic:
      // 55 (2 digits) + DDD (2 digits) + Number (8 digits) = 12 digits total
      // If 12 digits, it's an old mobile or missing the '9'.
      if (cleaned.length === 12) {
        // First digit of the number (index 4: 0,1 = '55'; 2,3 = DDD)
        const firstDigitOfNumber = cleaned.charAt(4);

        // Optional: check if it's a mobile (digits 6–9)
        if (parseInt(firstDigitOfNumber, 10) >= 6) {
          // Insert '9' at position 4 (after DDD)
          cleaned = cleaned.slice(0, 4) + "9" + cleaned.slice(4);
        }
      }
    }

    // 3. Return formatted with +
    return "+" + cleaned;
  }
}
