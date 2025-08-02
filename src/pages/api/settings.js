import db from "@/db";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    try {
      const user = await db.user.findUnique({
        where: { id: userId },
        select: { theme: true, font: true },
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      return res.status(200).json(user);
    } catch (error) {
      console.error("Error fetching user settings:", error);
      return res.status(500).json({ error: "Failed to fetch user settings" });
    }
  }

  if (req.method === "PATCH") {
    const { userId, theme, font } = req.body;

    if (!userId || !theme || !font) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      const updatedUser = await db.user.update({
        where: { id: userId },
        data: { theme, font },
      });

      return res.status(200).json(updatedUser);
    } catch (error) {
      console.error("Error updating user settings:", error);
      return res.status(500).json({ error: "Failed to update settings" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
