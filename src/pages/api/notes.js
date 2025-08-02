import db from "@/db";

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case "GET": // 특정 사용자의 모든 노트 가져오기
      try {
        const { userId } = req.query;

        if (!userId) {
          return res.status(400).json({ error: "User ID is required" });
        }

        const notes = await db.note.findMany({
          where: { userId },
          orderBy: [
            { isPinned: "desc" }, // Pin된 노트를 우선 정렬
            { id: "asc" },       // 나머지는 ID 순으로 정렬
          ],
        });

        return res.status(200).json(notes);
      } catch (error) {
        console.error("Error fetching notes:", error);
        return res.status(500).json({ error: "Failed to fetch notes" });
      }

    case "POST": // 새 노트 생성
      try {
        const { title, content, userId } = req.body;

        if (!userId || !title || !content) {
          return res.status(400).json({ error: "Missing required fields" });
        }

        const newNote = await db.note.create({
          data: { title, content, userId },
        });

        return res.status(201).json(newNote);
      } catch (error) {
        console.error("Error creating note:", error);
        return res.status(500).json({ error: "Failed to create note" });
      }

    case "PATCH": // 노트 내용 수정 또는 Pin 상태 변경
      try {
        const { id, title, content, isPinned } = req.body;
    
        if (!id) {
          return res.status(400).json({ error: "Note ID is required" });
        }
    
        const updateData = {};
        if (title !== undefined) updateData.title = title;
        if (content !== undefined) updateData.content = content;
        if (isPinned !== undefined) updateData.isPinned = isPinned;
    
        const updatedNote = await db.note.update({
          where: { id },
          data: updateData,
        });
    
        return res.status(200).json(updatedNote);
      } catch (error) {
        console.error("Error updating note:", error);
        return res.status(500).json({ error: "Failed to update note" });
      }

    case "DELETE": // 노트 삭제
      try {
        const { id } = req.body;

        if (!id) {
          return res.status(400).json({ error: "Note ID is required" });
        }

        await db.note.delete({ where: { id } });

        return res.status(200).json({ message: "Note deleted successfully" });
      } catch (error) {
        console.error("Error deleting note:", error);
        return res.status(500).json({ error: "Failed to delete note" });
      }

    default:
      res.setHeader("Allow", ["GET", "POST", "PATCH", "DELETE"]);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}
