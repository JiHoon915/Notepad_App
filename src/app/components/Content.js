import React, { useState, useEffect, useRef } from "react";
import SettingsDialog from "./SettingsDialog";

const Content = ({ note, onContentChange, highlightWord }) => {
  const [localNote, setLocalNote] = useState(note);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentHighlight, setCurrentHighlight] = useState(highlightWord);
  const textareaRef = useRef(null);

  const applySettings = (theme, font) => {
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.style.fontFamily =
      font === "ABeeZee"
        ? "ABeeZee, sans-serif"
        : font === "Pacifico"
        ? "Pacifico, cursive"
        : "Arimo, sans-serif";
  };

  const fetchSettings = async () => {
    try {
      const user = JSON.parse(sessionStorage.getItem("user"));
      if (!user || !user.id) return;

      const res = await fetch(`/api/settings?userId=${user.id}`);
      const { theme, font } = await res.json();

      applySettings(theme, font);
    } catch (error) {
      console.error("Error fetching user settings:", error);
    }
  };

  useEffect(() => {
    setLocalNote(note);
  }, [note]);

  useEffect(() => {
    fetchSettings();
  }, []);

  useEffect(() => {
    if (highlightWord) {
      setCurrentHighlight(highlightWord);
      const timer = setTimeout(() => setCurrentHighlight(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [highlightWord]);

  const renderHighlightedText = (text, word) => {
    if (!word) return text;
    const regex = new RegExp(`(${word})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <span
          key={index}
          style={{
            backgroundColor: "yellow",
            fontWeight: "bold",
          }}
        >
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <div
      className="flex-1 p-8 relative"
      style={{
        backgroundColor: "var(--bg-content)",
        color: "var(--text-content)",
      }}
    >
      <button
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        onClick={() => setIsDialogOpen(true)}
        style={{ fontSize: "2rem" }}
      >
        ⚙️
      </button>
      {localNote ? (
        <>
          <input
            type="text"
            className="text-3xl font-bold mb-4 w-full border-b p-2"
            style={{
              backgroundColor: "var(--input-bg)",
              color: "var(--text-content)",
              borderColor: "var(--input-border)",
            }}
            value={localNote.title}
            onChange={(e) => onContentChange("title", e.target.value)}
          />
          <div
            className="relative w-full h-96 border rounded-md shadow-sm"
            style={{
              backgroundColor: "var(--input-bg)",
              borderColor: "var(--input-border)",
            }}
          >
            <div
              className="absolute top-0 left-0 w-full h-full overflow-y-auto pointer-events-none p-4"
              style={{
                whiteSpace: "pre-wrap",
                wordWrap: "break-word",
                color: "transparent",
              }}
            >
              {renderHighlightedText(localNote.content, currentHighlight)}
            </div>
            <textarea
              ref={textareaRef}
              className="w-full h-full p-4 bg-transparent border-none resize-none"
              style={{
                color: "var(--text-content)",
                zIndex: 1,
                position: "relative",
              }}
              value={localNote.content}
              onChange={(e) => onContentChange("content", e.target.value)}
            />
          </div>
        </>
      ) : (
        <p className="text-gray-500">Select a note to view its content</p>
      )}
      <SettingsDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onApply={applySettings}
      />
    </div>
  );
};

export default Content;
