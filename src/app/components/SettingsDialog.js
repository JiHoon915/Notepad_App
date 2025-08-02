// Updated SettingsDialog.js
import React, { useState, useEffect } from "react";

const SettingsDialog = ({ isOpen, onClose, onApply, userId }) => {
  const [selectedTheme, setSelectedTheme] = useState("light");
  const [selectedFont, setSelectedFont] = useState("Pacifico");

  // Fetch current user settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch(`/api/user/${userId}`);
        if (res.ok) {
          const user = await res.json();
          setSelectedTheme(user.theme);
          setSelectedFont(user.font);
        } else {
          console.error("Failed to fetch user settings:", await res.text());
        }
      } catch (error) {
        console.error("Error fetching user settings:", error);
      }
    };

    if (userId) fetchSettings();
  }, [userId]);

  const applyChanges = async () => {
    try {
        const user = JSON.parse(sessionStorage.getItem("user"));
        if (!user || !user.id) {
          alert("User not found. Please log in again.");
          return;
        }
    
        const res = await fetch("/api/settings", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user.id,
            theme: selectedTheme,
            font: selectedFont,
          }),
        });

      if (!res.ok) {
        console.error("Failed to update settings in the database:", await res.text());
        alert("Failed to save settings to the database.");
        return;
      }

      const updatedUser = await res.json();
      console.log("Settings updated:", updatedUser);

      // Apply the settings in the app
      onApply(updatedUser.theme, updatedUser.font);

      // Close the dialog
      onClose();
    } catch (error) {
      console.error("Error updating settings:", error);
      alert("An error occurred while saving settings.");
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.5)", // Transparent overlay
      }}
    >
      <div
        className="w-96 p-6 rounded-lg shadow-lg"
        style={{
          backgroundColor: "var(--dialog-bg)",
          color: "var(--dialog-text)",
        }}
      >
        <h2 className="text-xl font-bold mb-4">Settings</h2>
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Theme</h3>
          <div className="flex space-x-4">
            <label>
              <input
                type="radio"
                name="theme"
                value="light"
                checked={selectedTheme === "light"}
                onChange={(e) => setSelectedTheme(e.target.value)}
              />
              <span className="ml-2">Light</span>
            </label>
            <label>
              <input
                type="radio"
                name="theme"
                value="dark"
                checked={selectedTheme === "dark"}
                onChange={(e) => setSelectedTheme(e.target.value)}
              />
              <span className="ml-2">Dark</span>
            </label>
          </div>
        </div>

        <div className="mb-4">
          <h3 className="font-semibold mb-2">Font</h3>
          <div className="space-y-2">
            <label style={{ fontFamily: "ABeeZee, sans-serif" }}>
              <input
                type="radio"
                name="font"
                value="ABeeZee"
                checked={selectedFont === "ABeeZee"}
                onChange={(e) => setSelectedFont(e.target.value)}
              />
              <span className="ml-2">ABeeZee</span>
            </label>
            <label style={{ fontFamily: "Pacifico, cursive" }}>
              <input
                type="radio"
                name="font"
                value="Pacifico"
                checked={selectedFont === "Pacifico"}
                onChange={(e) => setSelectedFont(e.target.value)}
              />
              <span className="ml-2">Pacifico</span>
            </label>
            <label style={{ fontFamily: "Arimo, sans-serif", fontWeight: "bold" }}>
              <input
                type="radio"
                name="font"
                value="Arimo"
                checked={selectedFont === "Arimo"}
                onChange={(e) => setSelectedFont(e.target.value)}
              />
              <span className="ml-2">Arimo</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
            onClick={onClose}
            style={{
              backgroundColor: "var(--button-bg)",
              color: "var(--button-text)",
            }}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            onClick={applyChanges}
            style={{
              backgroundColor: "var(--button-primary-bg)",
              color: "var(--button-primary-text)",
            }}
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsDialog;
