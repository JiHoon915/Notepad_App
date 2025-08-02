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
    // 기존에 동일한 ID가 있는지 확인
    const existingUser = await db.user.findUnique({
      where: { id },
    });

    if (existingUser) {
      return res.status(409).json({ message: "이미 사용 중인 ID입니다." });
    }

    // 새 유저 등록
    const newUser = await db.user.create({
      data: { id, password },
    });

    return res.status(201).json({ user: newUser });
  } catch (error) {
    return res.status(500).json({ message: "회원가입에 실패했습니다." });
  }
}
