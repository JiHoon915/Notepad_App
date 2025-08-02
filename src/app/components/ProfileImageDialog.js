import React, { useState } from "react";

function ProfileImageDialog({ userId, onClose, onProfileImageChange }) {
  const [image, setImage] = useState("");

  const handleChangeProfileImage = async () => {
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, profileImage: image }),
      });

      if (!res.ok) {
        console.error("Failed to update profile image:", await res.text());
        alert("Failed to update profile image.");
        return;
      }

      // 서버에서 반환된 업데이트된 사용자 정보
      const updatedUser = await res.json();

      // Sidebar에 변경된 프로필 이미지 전달
      onProfileImageChange(updatedUser.profileImage);

      alert("Profile image updated!");
      onClose(); // 다이얼로그 닫기
    } catch (error) {
      console.error("Error updating profile image:", error);
      alert("Error updating profile image.");
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.5)", // Transparent overlay
      }}
    >
      <div
        className="w-96 p-6 rounded shadow-lg"
        style={{
          backgroundColor: "var(--dialog-bg)",
          color: "var(--dialog-text)",
        }}
      >
        <h2 className="text-xl font-bold mb-4">Change Profile Image</h2>
        <input
          type="text"
          placeholder="Image URL"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
          style={{
            backgroundColor: "var(--input-bg)",
            color: "var(--input-text)",
            borderColor: "var(--input-border)",
          }}
        />
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded mr-2"
            style={{
              backgroundColor: "var(--button-bg)",
              color: "var(--button-text)",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleChangeProfileImage}
            className="px-4 py-2 rounded"
            style={{
              backgroundColor: "var(--button-primary-bg)",
              color: "var(--button-primary-text)",
            }}
          >
            Change
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfileImageDialog;
