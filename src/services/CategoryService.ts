import { db } from "../db";
import { categories } from "../db/schema";
import { eq } from "drizzle-orm";

export class CategoryService {
  async getAll() {
    return await db.select().from(categories);
  }

  async getById(id: string) {
    const [category] = await db
      .select()
      .from(categories)
      .where(eq(categories.id, id))
      .limit(1);
    return category;
  }

  // Additional methods as needed
}
