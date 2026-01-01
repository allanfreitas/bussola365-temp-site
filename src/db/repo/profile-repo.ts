import { eq } from "drizzle-orm";
import { db } from "..";
import { Profile, profiles } from "../schema";


class ProfileRepo {
    async updateProfile(profile: Profile) {
        const updatedProfile = await db.update(profiles).set(profile).where(eq(profiles.id, profile.id));
        return updatedProfile;
    }
    async getProfile(profileId: string): Promise<Profile> {
        const profile = await db.select().from(profiles).where(eq(profiles.id, profileId));
        if (profile.length > 0) {
            return profile[0];
        }

        throw new Error("Profile not found");
    }
}

const profileRepo = new ProfileRepo();
export default profileRepo;
