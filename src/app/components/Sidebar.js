import React, { useEffect, useState } from "react";
import ProfileImageDialog from "./ProfileImageDialog";
import SearchDialog from "./SearchDialog";

function Sidebar({ notes, onAddNote, onNoteClick, onDeleteNote, setHighlightedWord, setNotes }) {
  const [userId, setUserId] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // 로그인한 사용자 정보 가져오기
  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (user && user.id) {
      setUserId(user.id); // 사용자 ID 설정
      setProfileImage(user.profileImage || "/profile.jpg"); // 사용자 프로필 이미지 설정
    }
  }, []);

  const handleProfileImageChange = (newImage) => {
    setProfileImage(newImage); // 프로필 이미지 상태 업데이트
    const user = JSON.parse(sessionStorage.getItem("user"));
    sessionStorage.setItem(
      "user",
      JSON.stringify({ ...user, profileImage: newImage }) // sessionStorage에 새 이미지 저장
    );
  };

  const handlePinToggle = async (note) => {
    try {
      const updatedNote = { ...note, isPinned: !note.isPinned };

      // 서버에 Pin 상태 업데이트 요청
      await fetch("/api/notes", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: note.id,
          isPinned: updatedNote.isPinned,
        }),
      });

      // Pin 상태 업데이트 후 즉시 리스트 재정렬
      const updatedNotes = notes.map((n) =>
        n.id === note.id ? updatedNote : n
      );
      updatedNotes.sort((a, b) => {
        if (a.isPinned !== b.isPinned) return b.isPinned - a.isPinned;
        return b.id - a.id;
      });

      setNotes(updatedNotes);
    } catch (error) {
      console.error("Error toggling pin:", error);
    }
  };

  return (
    <div
      className="w-64 h-screen p-5"
      style={{
        backgroundColor: "var(--bg-sidebar)",
        color: "var(--text-sidebar)",
      }}
    >
      <div className="flex items-center mb-8">
        <img
          src={profileImage || "/profile.jpg"}
          alt="Profile"
          className="w-10 h-10 rounded-md mr-3 cursor-pointer"
          onClick={() => setIsDialogOpen(true)}
        />
        <div className="text-lg font-semibold truncate">{userId || "Loading..."}</div>
        <svg
          role="graphics-symbol"
          viewBox="0 0 24 24"
          className="w-6 h-6 ml-auto"
          style={{ fill: "var(--text-sidebar)" }}
        >
          <g>
            <path d="M9.944 14.721c.104.094.216.12.336.079l1.703-.688 6.844-6.844-1.406-1.398-6.836 6.836-.711 1.68c-.052.13-.029.242.07.335zm8.102-9.484l1.414 1.406.515-.523a.917.917 0 00.282-.633.76.76 0 00-.258-.61l-.25-.25a.702.702 0 00-.578-.187.975.975 0 00-.617.297l-.508.5zm-9.453.127a3.85 3.85 0 00-3.85 3.85v6.5a3.85 3.85 0 003.85 3.85h6.5a3.85 3.85 0 003.85-3.85V12.95a.85.85 0 10-1.7 0v2.764a2.15 2.15 0 01-2.15 2.15h-6.5a2.15 2.15 0 01-2.15-2.15v-6.5a2.15 2.15 0 012.15-2.15h3.395a.85.85 0 000-1.7H8.593z"></path>
          </g>
        </svg>
      </div>

      <ul className="menu mb-8">
        {/* Search 버튼 */}
        <li
          className="menu-item flex items-center mb-4 cursor-pointer"
          onClick={() => setIsSearchOpen(true)}
        >
          <svg viewBox="0 0 20 20" className="w-5 h-5 mr-2">
            <path fillRule="evenodd" clipRule="evenodd" d="M4 8.75C4 6.12665 6.12665 4 8.75 4C11.3734 4 13.5 6.12665 13.5 8.75C13.5 11.3734 11.3734 13.5 8.75 13.5C6.12665 13.5 4 11.3734 4 8.75ZM8.75 2.5C5.29822 2.5 2.5 5.29822 2.5 8.75C2.5 12.2018 5.29822 15 8.75 15C10.2056 15 11.545 14.5024 12.6073 13.668L16.7197 17.7803C17.0126 18.0732 17.4874 18.0732 17.7803 17.7803C18.0732 17.4874 18.0732 17.0126 17.7803 16.7197L13.668 12.6073C14.5024 11.545 15 10.2056 15 8.75C15 5.29822 12.2018 2.5 8.75 2.5Z"></path>
          </svg>
          Search
        </li>
        {/* Home 버튼 */}
        <li className="menu-item flex items-center mb-4 cursor-pointer">
          <svg viewBox="0 0 20 20" className="w-5 h-5 mr-2">
            <path d="M10.1416 3.77299C10.0563 3.71434 9.94368 3.71434 9.85837 3.77299L3.60837 8.06989C3.54053 8.11653 3.5 8.19357 3.5 8.2759V14.2499C3.5 14.9402 4.05964 15.4999 4.75 15.4999H7.5L7.5 10.7499C7.5 10.0595 8.05964 9.49987 8.75 9.49987H11.25C11.9404 9.49987 12.5 10.0595 12.5 10.7499L12.5 15.4999H15.25C15.9404 15.4999 16.5 14.9402 16.5 14.2499V8.2759C16.5 8.19357 16.4595 8.11653 16.3916 8.06989L10.1416 3.77299ZM9.00857 2.53693C9.60576 2.12636 10.3942 2.12636 10.9914 2.53693L17.2414 6.83383C17.7163 7.1603 18 7.69963 18 8.2759V14.2499C18 15.7687 16.7688 16.9999 15.25 16.9999H12.25C11.5596 16.9999 11 16.4402 11 15.7499L11 10.9999H9L9 15.7499C9 16.4402 8.44036 16.9999 7.75 16.9999H4.75C3.23122 16.9999 2 15.7687 2 14.2499V8.2759C2 7.69963 2.2837 7.1603 2.75857 6.83383L9.00857 2.53693Z"></path>
          </svg>
          Home
        </li>
      </ul>

      <div className="section-title text-gray-500 uppercase mb-4">Private</div>
      <ul className="menu mb-8">
        {notes.map((note) => (
          <li
            key={note.id}
            className="menu-item flex items-center justify-between mb-4 cursor-pointer group"
          >
            <div className="flex items-center group" onClick={() => onNoteClick(note)}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePinToggle(note);
                }}
                className={`mr-2 text-lg text-yellow-500 ${
                  note.isPinned ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                } transition-opacity`}
              >
                {note.isPinned ? "★" : "☆"}
              </button>
              <span>{note.title}</span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation(); // 부모 이벤트 전파 방지
                onDeleteNote(note.id);
              }}
              className="text-red-500 hover:text-red-700"
            >
              Delete
            </button>
          </li>
        ))}
        <li
          className="menu-item flex items-center mb-4 cursor-pointer"
          onClick={onAddNote}
        >
          <svg viewBox="0 0 16 16" className="w-4 h-4 mr-2">
            <path d="M4.35645 15.4678H11.6367C13.0996 15.4678 13.8584 14.6953 13.8584 13.2256V7.02539C13.8584 6.0752 13.7354 5.6377 13.1406 5.03613L9.55176 1.38574C8.97754 0.804688 8.50586 0.667969 7.65137 0.667969H4.35645C2.89355 0.667969 2.13477 1.44043 2.13477 2.91016V13.2256C2.13477 14.7021 2.89355 15.4678 4.35645 15.4678ZM4.46582 14.1279C3.80273 14.1279 3.47461 13.7793 3.47461 13.1436V2.99219C3.47461 2.36328 3.80273 2.00781 4.46582 2.00781H7.37793V5.75391C7.37793 6.73145 7.86328 7.20312 8.83398 7.20312H12.5186V13.1436C12.5186 13.7793 12.1836 14.1279 11.5205 14.1279H4.46582ZM8.95703 6.02734C8.67676 6.02734 8.56055 5.9043 8.56055 5.62402V2.19238L12.334 6.02734H8.95703Z"></path>
          </svg>
          + New Page
        </li>
      </ul>
      {isDialogOpen && (
        <ProfileImageDialog
          userId={userId}
          onClose={() => setIsDialogOpen(false)}
          onProfileImageChange={handleProfileImageChange}
        />
      )}

      {isSearchOpen && (
        <SearchDialog
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          notes={notes}
          onResultClick={(note, query) => {
            onNoteClick(note);
            setHighlightedWord(query); // Set the search term for highlighting
            setIsSearchOpen(false);
          }}
        />
      )}
    </div>
  );
}

export default Sidebar;
