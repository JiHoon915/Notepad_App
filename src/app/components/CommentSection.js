import React, { useState } from "react";

const CommentSection = ({ comments, onAddComment, onDeleteComment }) => {
  const [newComment, setNewComment] = useState("");

  const handleAddCommentClick = () => {
    if (newComment.trim()) {
      onAddComment(newComment);
      setNewComment("");
    }
  };

  return (
    <div
      className="w-64 h-screen p-4 border-l overflow-y-auto"
      style={{
        backgroundColor: "var(--bg-sidebar)",
        color: "var(--text-sidebar)",
      }}
    >
      <h2 className="text-lg font-bold mb-4">Comments</h2>
      <ul className="space-y-2 mb-4">
        {comments.map((comment) => (
          <li
            key={comment.id}
            className="text-sm text-gray-800 dark:text-white flex justify-between items-center"
          >
            <div>
              <p>{comment.content}</p>
              <span className="text-xs text-gray-500">
                {new Date(comment.createdAt).toLocaleString()}
              </span>
            </div>
            <button
              onClick={() => onDeleteComment(comment.id)}
              className="text-red-500 hover:text-red-700 ml-2"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      <textarea
        className="w-full p-2 border rounded mb-2"
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        placeholder="Add a comment..."
      />
      <button
        className="w-full bg-blue-500 text-white py-1 rounded"
        onClick={handleAddCommentClick}
      >
        Add Comment
      </button>
    </div>
  );
};

export default CommentSection;
