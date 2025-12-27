import { db } from "@/db";
import { profiles, wallets, walletMembers } from "@/db/schema";
import { eq } from "drizzle-orm";

export class WalletService {
    /**
     * Ensures that a profile has a wallet. If not, creates a default one.
     * Returns the walletId.
     */
    async ensureWalletForProfile(profileId: string, profileName: string): Promise<string> {
        const membership = await db.query.walletMembers.findFirst({
            where: eq(walletMembers.profileId, profileId),
        });

        if (membership) {
            return membership.walletId;
        }

        // Create new Wallet
        const [wallet] = await db
            .insert(wallets)
            .values({
                name: profileName || "Pessoal",
                description: "Conta Pessoal",
            })
            .returning({ id: wallets.id });

        // Add Member
        await db.insert(walletMembers).values({
            walletId: wallet.id,
            profileId: profileId,
            role: "owner",
        });

        return wallet.id;
    }
}

export const walletService = new WalletService();
