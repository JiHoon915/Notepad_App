import db from "@/db";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { userId, query } = req.body;

    if (!userId || !query) {
      return res.status(400).json({ error: "User ID and search query are required." });
    }

    try {
      const notes = await db.note.findMany({
        where: {
          userId: userId,
          OR: [
            {
              title: {
                contains: query,
                mode: "insensitive",
              },
            },
            {
              content: {
                contains: query,
                mode: "insensitive",
              },
            },
          ],
        },
      });

      res.status(200).json(notes);
    } catch (error) {
      console.error("Error searching notes:", error);
      res.status(500).json({ error: "Failed to search notes." });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
