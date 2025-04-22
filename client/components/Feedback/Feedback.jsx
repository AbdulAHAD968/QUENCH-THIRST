import React, { useState } from "react";
import { FaStar, FaReply, FaTrash } from "react-icons/fa";
import "./Feedback.css";

const Feedback = () => {
  const [feedbackList, setFeedbackList] = useState([
    { 
      id: 1, 
      user: "John Doe", 
      comment: "Great service! Highly recommend.", 
      rating: 5,
      type: "positive",
      response: "" 
    },
    { 
      id: 2, 
      user: "Jane Smith", 
      comment: "Delivery was late, but the product is good.", 
      rating: 3,
      type: "neutral",
      response: "" 
    },
    { 
      id: 3, 
      user: "Alice Johnson", 
      comment: "Poor customer support.", 
      rating: 1,
      type: "negative",
      response: "" 
    },
  ]);

  const [filter, setFilter] = useState("all");
  const [newResponse, setNewResponse] = useState("");
  const [editingResponseId, setEditingResponseId] = useState(null);

  // Categorize feedback based on rating
  const categorizeFeedback = (rating) => {
    if (rating >= 4) return "positive";
    if (rating >= 2) return "neutral";
    return "negative";
  };

  // Delete feedback
  const deleteFeedback = (id) => {
    setFeedbackList(feedbackList.filter((feedback) => feedback.id !== id));
  };

  // Add/update response
  const handleResponseSubmit = (id) => {
    setFeedbackList(
      feedbackList.map((feedback) =>
        feedback.id === id 
          ? { ...feedback, response: newResponse } 
          : feedback
      )
    );
    setEditingResponseId(null);
    setNewResponse("");
  };

  // Filter feedback
  const filteredFeedback = feedbackList.filter((feedback) => {
    if (filter === "all") return true;
    return feedback.type === filter;
  });

  return (
    <div className="feedback-container">
      <h2>User Feedback</h2>
      
      {/* Filter Buttons */}
      <div className="feedback-filters">
        <button 
          className={filter === "all" ? "active" : ""} 
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button 
          className={filter === "positive" ? "active" : ""} 
          onClick={() => setFilter("positive")}
        >
          Positive ({feedbackList.filter(f => f.type === "positive").length})
        </button>
        <button 
          className={filter === "neutral" ? "active" : ""} 
          onClick={() => setFilter("neutral")}
        >
          Neutral ({feedbackList.filter(f => f.type === "neutral").length})
        </button>
        <button 
          className={filter === "negative" ? "active" : ""} 
          onClick={() => setFilter("negative")}
        >
          Negative ({feedbackList.filter(f => f.type === "negative").length})
        </button>
      </div>

      {/* Feedback List */}
      <div className="feedback-list">
        {filteredFeedback.map((feedback) => (
          <div 
            key={feedback.id} 
            className={`feedback-card ${feedback.type}`}
          >
            <div className="feedback-header">
              <h3>{feedback.user}</h3>
              <div className="star-rating">
                {[...Array(5)].map((_, i) => (
                  <FaStar 
                    key={i} 
                    color={i < feedback.rating ? "#FFD700" : "#C0C0C0"} 
                  />
                ))}
              </div>
            </div>
            
            <p className="feedback-comment">{feedback.comment}</p>
            
            {/* Response Section */}
            {feedback.response ? (
              <div className="response-section">
                <strong>Your Response:</strong>
                <p>{feedback.response}</p>
                <button 
                  onClick={() => setEditingResponseId(feedback.id)}
                  className="edit-response"
                >
                  <FaReply /> Edit Response
                </button>
              </div>
            ) : (
              editingResponseId === feedback.id ? (
                <div className="response-form">
                  <textarea
                    value={newResponse}
                    onChange={(e) => setNewResponse(e.target.value)}
                    placeholder="Write your response..."
                  />
                  <button 
                    onClick={() => handleResponseSubmit(feedback.id)}
                    className="submit-response"
                  >
                    Submit
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setEditingResponseId(feedback.id)}
                  className="add-response"
                >
                  <FaReply /> Add Response
                </button>
              )
            )}

            <button 
              onClick={() => deleteFeedback(feedback.id)}
              className="delete-feedback"
            >
              <FaTrash /> Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Feedback;