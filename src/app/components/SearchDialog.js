import React, { useState, useEffect } from "react";

const SearchDialog = ({ isOpen, onClose, notes, onResultClick }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  // Update search results dynamically as the query changes
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const lowerCaseQuery = query.toLowerCase();
    const matches = notes.filter(
      (note) =>
        note.title.toLowerCase().includes(lowerCaseQuery) || // Match title
        note.content.toLowerCase().includes(lowerCaseQuery) // Match content
    );
    setResults(matches);
  }, [query, notes]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
    >
      <div
        className="w-96 p-6 rounded-lg shadow-lg bg-white dark:bg-gray-800"
        style={{
          backgroundColor: "var(--dialog-bg)",
          color: "var(--dialog-text)",
        }}
      >
        <h2 className="text-xl font-bold mb-4">Search Notes</h2>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Type to search..."
          className="w-full mb-4 p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        <ul className="space-y-2">
          {results.length > 0 ? (
            results.map((note) => (
              <li
                key={note.id}
                onClick={() => {
                  onResultClick(note, query);
                  onClose();
                }}
                className="cursor-pointer text-gray-800 dark:text-white hover:underline"
              >
                <strong>{note.title}</strong>: Matched "{query}"
              </li>
            ))
          ) : (
            <li className="text-gray-500 dark:text-gray-400">
              No matches found
            </li>
          )}
        </ul>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-gray-300 dark:bg-gray-700 text-black dark:text-white rounded"
          style={{
            backgroundColor: "var(--button-bg)",
            color: "var(--button-text)",
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default SearchDialog;
