"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/app/components/Sidebar";
import Content from "@/app/components/Content";
import CommentSection from "@/app/components/CommentSection";

export default function NotesPage() {
  const router = useRouter();
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [user, setUser] = useState(null);
  const [highlightedWord, setHighlightedWord] = useState("");
  const [comments, setComments] = useState([]);

  // 사용자 인증 확인
  useEffect(() => {
    const userData = sessionStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
    } else {
      router.push("/"); // 로그인 페이지로 리다이렉트
    }
  }, [router]);

  // 노트 가져오기
  useEffect(() => {
    async function fetchNotes() {
      const user = JSON.parse(sessionStorage.getItem("user"));
      if (!user || !user.id) {
        console.error("User ID is missing");
        return;
      }

      const res = await fetch(`/api/notes?userId=${user.id}`);
      if (!res.ok) {
        console.error("Failed to fetch notes:", await res.text());
        return;
      }

      const data = await res.json();
      setNotes(data);
      if (data.length > 0) {
        setSelectedNote(data[0]);
      }
    }

    fetchNotes();
  }, []);

  // 노트 선택 시 댓글 가져오기
  useEffect(() => {
    if (selectedNote) {
      async function fetchComments() {
        const res = await fetch(`/api/comments?noteId=${selectedNote.id}`);
        if (res.ok) {
          const data = await res.json();
          setComments(data);
        } else {
          console.error("Failed to fetch comments:", await res.text());
        }
      }
      fetchComments();
    }
  }, [selectedNote]);

  // 댓글 추가 처리
  const handleAddComment = async (content) => {
    if (!content.trim() || !selectedNote || !user) {
      console.error("Missing noteId, userId, or comment content.");
      return;
    }

    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        noteId: selectedNote.id,
        userId: user.id,
        content,
      }),
    });

    if (res.ok) {
      const newComment = await res.json();
      setComments((prevComments) => [...prevComments, newComment]);
    } else {
      console.error("Failed to add comment:", await res.text());
    }
  };

  // 댓글 삭제 처리
  const handleDeleteComment = async (commentId) => {
    try {
      const res = await fetch("/api/comments", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commentId }),
      });

      if (res.ok) {
        setComments((prevComments) =>
          prevComments.filter((comment) => comment.id !== commentId)
        );
      } else {
        console.error("Failed to delete comment:", await res.text());
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  // 노트 내용 변경
  const handleContentChange = async (field, value) => {
    if (!selectedNote) return;

    const updatedNote = { ...selectedNote, [field]: value };
    setNotes(
      notes.map((note) => (note.id === selectedNote.id ? updatedNote : note))
    );
    setSelectedNote(updatedNote);

    try {
      const res = await fetch("/api/notes", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: selectedNote.id,
          [field]: value,
        }),
      });

      if (!res.ok) {
        console.error("Failed to update note:", await res.text());
      }
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };

  // 새 노트 추가
  const handleAddNote = async () => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    const newNote = {
      title: "New Note",
      content: "Start writing your note here...",
      userId: user.id,
    };

    const res = await fetch("/api/notes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newNote),
    });

    const createdNote = await res.json();
    setNotes([...notes, createdNote]);
    setSelectedNote(createdNote);
  };

  // 노트 삭제 처리
  const handleDeleteNote = async (noteId) => {
    try {
      const res = await fetch("/api/notes", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: noteId }),
      });

      if (!res.ok) {
        console.error("Failed to delete note:", await res.text());
        return;
      }

      setNotes(notes.filter((note) => note.id !== noteId));
      if (selectedNote?.id === noteId) {
        setSelectedNote(null);
      }
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  const handleSearchResultClick = (note, word) => {
    setSelectedNote(note);
    setHighlightedWord(word);
  };

  return (
    <div className="flex">
      <Sidebar
        notes={notes}
        onAddNote={handleAddNote}
        onNoteClick={setSelectedNote}
        onDeleteNote={handleDeleteNote}
        setNotes={setNotes}
        user={user}
        onSearchResultClick={handleSearchResultClick}
        setHighlightedWord={setHighlightedWord}
      />
      <Content
        note={selectedNote}
        onContentChange={handleContentChange}
        highlightWord={highlightedWord}
      />
      {selectedNote && user && (
        <CommentSection
          comments={comments}
          onAddComment={handleAddComment}
          onDeleteComment={handleDeleteComment}
        />
      )}
    </div>
  );
}
