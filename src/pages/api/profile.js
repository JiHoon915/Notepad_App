import db from "@/db";

export default async function handler(req, res) {
  const { method } = req;

  if (method === "POST") {
    try {
      const { userId, profileImage } = req.body;

      if (!userId || !profileImage) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // profileImage 필드를 업데이트
      const updatedUser = await db.user.update({
        where: { id: userId },
        data: { profileImage },
      });

      return res.status(200).json(updatedUser);
    } catch (error) {
      console.error("Error updating profile image:", error);
      return res.status(500).json({ error: "Failed to update profile image" });
    }
  }

  res.setHeader("Allow", ["POST"]);
  return res.status(405).end(`Method ${method} Not Allowed`);
}
