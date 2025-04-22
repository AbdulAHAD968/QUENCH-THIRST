import React, { useState } from "react";
import { FaStar } from "react-icons/fa";
import "./UserFeedback.css";

const UserFeedback = () => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(null);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [feedbackType, setFeedbackType] = useState("general");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the feedback to your backend
    console.log({
      rating,
      comment,
      type: feedbackType
    });
    setSubmitted(true);
  };

  const resetForm = () => {
    setRating(0);
    setComment("");
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <div className="user-feedback-container">
        <div className="thank-you-message">
          <h2>Thank You for Your Feedback!</h2>
          <p>We appreciate you taking the time to share your experience with us.</p>
          <button onClick={resetForm} className="submit-btn">
            Submit Another Feedback
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="user-feedback-container">
      <h2>Share Your Feedback</h2>
      <p>We value your opinion. Please let us know about your experience.</p>
      
      <form onSubmit={handleSubmit} className="feedback-form">
        <div className="form-group">
          <label>Feedback Type</label>
          <select 
            value={feedbackType}
            onChange={(e) => setFeedbackType(e.target.value)}
            className="feedback-type"
          >
            <option value="general">General Feedback</option>
            <option value="order">Order Experience</option>
            <option value="product">Product Feedback</option>
            <option value="support">Customer Support</option>
          </select>
        </div>

        <div className="form-group">
          <label>Your Rating</label>
          <div className="star-rating">
            {[...Array(5)].map((star, i) => {
              const ratingValue = i + 1;
              return (
                <label key={i}>
                  <input
                    type="radio"
                    name="rating"
                    value={ratingValue}
                    onClick={() => setRating(ratingValue)}
                  />
                  <FaStar
                    className="star"
                    color={ratingValue <= (hover || rating) ? "#FFD700" : "#C0C0C0"}
                    size={30}
                    onMouseEnter={() => setHover(ratingValue)}
                    onMouseLeave={() => setHover(null)}
                  />
                </label>
              );
            })}
          </div>
        </div>

        <div className="form-group">
          <label>Your Comments</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Tell us about your experience..."
            required
          />
        </div>

        <button type="submit" className="submit-btn">
          Submit Feedback
        </button>
      </form>
    </div>
  );
};

export default UserFeedback;