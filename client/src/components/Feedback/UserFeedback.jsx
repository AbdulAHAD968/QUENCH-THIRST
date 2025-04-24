import React, { useState } from "react";
import { FaStar } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import "./UserFeedback.css";

const UserFeedback = () => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(null);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [feedbackType, setFeedbackType] = useState("general");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const user = JSON.parse(localStorage.getItem("user"));
        if (!user || !user._id) {
          throw new Error("User not authenticated");
        }

        const response = await axios.post("/api/feedback", {
          userId: user._id,
          userName: user.name,
          rating,
          comment,
          feedbackType
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });      

      toast.success("Feedback submitted successfully!", {
        icon: "✅"
      });
      setSubmitted(true);
    } 
    catch (error) {
      const message = error.response?.data?.message || 
                     error.message || 
                     "Failed to submit feedback";
      toast.error(message, {
        icon: "❌"
      });
    } 
    finally {
      setIsLoading(false);
    }
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
            disabled={isLoading}
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
                    disabled={isLoading}
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
            disabled={isLoading}
          />
        </div>

        <button 
          type="submit" 
          className="submit-btn"
          disabled={isLoading || !comment || rating === 0}
        >
          {isLoading ? "Submitting..." : "Submit Feedback"}
        </button>
      </form>
    </div>
  );
};

export default UserFeedback;