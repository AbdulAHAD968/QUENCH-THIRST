import React, { useState } from "react";
import "./Feedback.css";

const Feedback = () => {
  const [feedbackList, setFeedbackList] = useState([
    { id: 1, user: "John Doe", comment: "Great service! Highly recommend.", type: "positive" },
    { id: 2, user: "Jane Smith", comment: "Delivery was late, but the product is good.", type: "neutral" },
    { id: 3, user: "Alice Johnson", comment: "Poor customer support.", type: "negative" },
  ]);
  const [filter, setFilter] = useState("all"); // all, positive, neutral, negative

  const deleteFeedback = (id) => {
    setFeedbackList(feedbackList.filter((feedback) => feedback.id !== id));
  };

  const filteredFeedback = feedbackList.filter((feedback) => {
    if (filter === "all") return true;
    return feedback.type === filter;
  });

  return (
    <div className="feedback">
      <h2>User Feedback</h2>
      <div className="filter-buttons">
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
          Positive
        </button>
        <button
          className={filter === "neutral" ? "active" : ""}
          onClick={() => setFilter("neutral")}
        >
          Neutral
        </button>
        <button
          className={filter === "negative" ? "active" : ""}
          onClick={() => setFilter("negative")}
        >
          Negative
        </button>
      </div>
      <ul>
        {filteredFeedback.map((feedback) => (
          <li key={feedback.id} className={`feedback-item ${feedback.type}`}>
            <div className="feedback-content">
              <p className="user">{feedback.user}</p>
              <p className="comment">{feedback.comment}</p>
            </div>
            <button onClick={() => deleteFeedback(feedback.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Feedback;