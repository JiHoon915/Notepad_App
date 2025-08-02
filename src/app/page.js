"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isRegistering ? "/api/auth/register" : "/api/auth/login";
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, password }),
      });
      const data = await res.json();

      if (res.ok) {
        if (!isRegistering) {
          // 로그인 성공 처리
          sessionStorage.setItem("user", JSON.stringify(data.user)); // 사용자 정보 저장
          alert("Login successful!");
          router.push("/notes"); // 노트 페이지로 이동
        } else {
          // 회원가입 성공 처리
          alert("Registration successful! You can now log in.");
          setIsRegistering(false); // 회원가입 화면에서 로그인 화면으로 전환
        }
      } else {
        // 서버에서 반환한 에러 메시지 처리
        alert(data.message || "An error occurred. Please try again.");
      }
    } catch (error) {
      // 네트워크 오류 등 처리
      alert("An error occurred. Please check your internet connection.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h1 className="text-2xl font-bold text-center mb-4">
          {isRegistering ? "Register" : "Login"} to Note App
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="ID"
            value={id}
            onChange={(e) => setId(e.target.value)}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:ring-purple-500"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:ring-purple-500"
            required
          />
          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition"
          >
            {isRegistering ? "Register" : "Login"}
          </button>
        </form>
        <button
          onClick={() => setIsRegistering(!isRegistering)}
          className="mt-4 w-full text-purple-600 underline"
        >
          {isRegistering ? "Switch to Login" : "Switch to Register"}
        </button>
      </div>
    </div>
  );
}
