import db from "@/db";

export default async function handler(req, res) {
  const { method } = req;

  if (method === "GET") {
    try {
      const { noteId } = req.query;

      if (!noteId) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const comments = await db.comment.findMany({
        where: { noteId: parseInt(noteId, 10) },
        orderBy: { createdAt: "asc" },
      });

      return res.status(200).json(comments);
    } catch (error) {
      console.error("Error fetching comments:", error);
      return res.status(500).json({ error: "Failed to fetch comments" });
    }
  }

  if (method === "POST") {
    try {
      const { noteId, userId, content } = req.body;

      if (!noteId || !userId || !content) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const newComment = await db.comment.create({
        data: {
          noteId: parseInt(noteId, 10),
          userId,
          content,
        },
      });

      return res.status(201).json(newComment);
    } catch (error) {
      console.error("Error adding comment:", error);
      return res.status(500).json({ error: "Failed to add comment" });
    }
  }

  if (method === "DELETE") {
    try {
      const { commentId } = req.body;

      if (!commentId) {
        return res.status(400).json({ error: "Missing commentId" });
      }

      await db.comment.delete({
        where: { id: parseInt(commentId, 10) },
      });

      return res.status(204).end();
    } catch (error) {
      console.error("Error deleting comment:", error);
      return res.status(500).json({ error: "Failed to delete comment" });
    }
  }

  res.setHeader("Allow", ["GET", "POST", "DELETE"]);
  return res.status(405).end(`Method ${method} Not Allowed`);
}
