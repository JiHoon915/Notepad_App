import db from "@/db";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { id, password } = req.body;

  if (!id || !password) {
    return res.status(400).json({ message: "ID와 비밀번호를 입력하세요." });
  }

  try {
    // 유저 검색
    const user = await db.user.findUnique({
      where: { id },
    });

    if (!user || user.password !== password) {
      return res.status(401).json({ message: "ID 또는 비밀번호가 잘못되었습니다." });
    }

    // 유저 정보를 반환 (비밀번호 제외)
    const { password: _, ...userWithoutPassword } = user;
    return res.status(200).json({ user: userWithoutPassword });
  } catch (error) {
    return res.status(500).json({ message: "로그인에 실패했습니다." });
  }
}
