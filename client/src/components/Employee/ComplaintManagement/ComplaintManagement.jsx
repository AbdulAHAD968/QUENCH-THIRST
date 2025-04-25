import React, { useState, useEffect } from "react";
import { FaStar, FaReply, FaTrash } from "react-icons/fa";
import axios from "axios";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./ComplaintManagement.css";

const ComplaintManagement = () => {
  const [feedbackList, setFeedbackList] = useState([]);
  const [filter, setFilter] = useState("all");
  const [newResponse, setNewResponse] = useState("");
  const [editingResponseId, setEditingResponseId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all feedback from backend
  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const { data } = await axios.get("/api/feedback/admin/all", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        setFeedbackList(data.data);
        toast.success("Feedback loaded successfully");
      } catch (error) {
        const errorMsg = error.response?.data?.message || "Failed to load feedback";
        console.error("Error fetching feedback:", error);
        toast.error(errorMsg);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFeedback();
  }, []);

  // Categorize feedback based on rating
  const categorizeFeedback = (rating) => {
    if (rating >= 4) return "positive";
    if (rating >= 2) return "neutral";
    return "negative";
  };

  // Delete feedback
  const deleteFeedback = async (id) => {
    if (!window.confirm("Are you sure you want to delete this feedback?")) {
      toast.info("Feedback deletion cancelled");
      return;
    }

    try {
      await axios.delete(`/api/feedback/admin/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      setFeedbackList(feedbackList.filter((feedback) => feedback._id !== id));
      toast.success("Feedback deleted successfully");
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Failed to delete feedback";
      console.error("Error deleting feedback:", error);
      toast.error(errorMsg);
    }
  };

  // Add/update response
  const handleResponseSubmit = async (id) => {
    if (!newResponse.trim()) {
      toast.warning("Please enter a response before submitting");
      return;
    }

    try {
      const { data } = await axios.put(
        `/api/feedback/admin/respond/${id}`,
        { response: newResponse },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );
      
      setFeedbackList(
        feedbackList.map((feedback) =>
          feedback._id === id 
            ? { ...feedback, adminResponse: newResponse } 
            : feedback
        )
      );
      setEditingResponseId(null);
      setNewResponse("");
      toast.success("Response submitted successfully");
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Failed to submit response";
      console.error("Error submitting response:", error);
      toast.error(errorMsg);
    }
  };

  // Filter feedback
  const filteredFeedback = feedbackList.filter((feedback) => {
    if (filter === "all") return true;
    return categorizeFeedback(feedback.rating) === filter;
  });

  if (isLoading) return <div className="feedback-container">Loading feedback...</div>;

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
          Positive ({feedbackList.filter(f => categorizeFeedback(f.rating) === "positive").length})
        </button>
        <button 
          className={filter === "neutral" ? "active" : ""} 
          onClick={() => setFilter("neutral")}
        >
          Neutral ({feedbackList.filter(f => categorizeFeedback(f.rating) === "neutral").length})
        </button>
        <button 
          className={filter === "negative" ? "active" : ""} 
          onClick={() => setFilter("negative")}
        >
          Negative ({feedbackList.filter(f => categorizeFeedback(f.rating) === "negative").length})
        </button>
      </div>

      {/* Feedback List */}
      <div className="feedback-list">
        {filteredFeedback.length > 0 ? (
          filteredFeedback.map((feedback) => (
            <div 
              key={feedback._id} 
              className={`feedback-card ${categorizeFeedback(feedback.rating)}`}
            >
              <div className="feedback-header">
                <h3>User ID: {feedback.user._id}</h3>
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
              <small className="feedback-date">
                {new Date(feedback.createdAt).toLocaleString()}
              </small>
              
              {/* Response Section */}
              {feedback.adminResponse ? (
                <div className="response-section">
                  <strong>Your Response:</strong>
                  <p>{feedback.adminResponse}</p>
                  <button 
                    onClick={() => {
                      setEditingResponseId(feedback._id);
                      setNewResponse(feedback.adminResponse);
                    }}
                    className="edit-response"
                  >
                    Edit Response
                  </button>
                </div>
              ) : (
                editingResponseId === feedback._id ? (
                  <div className="response-form">
                    <textarea
                      value={newResponse}
                      onChange={(e) => setNewResponse(e.target.value)}
                      placeholder="Write your response..."
                    />
                    <div className="response-actions">
                      <button 
                        onClick={() => handleResponseSubmit(feedback._id)}
                        className="submit-response"
                      >
                        Submit
                      </button>
                      <button 
                        onClick={() => {
                          setEditingResponseId(null);
                          setNewResponse("");
                          toast.info("Response editing cancelled");
                        }}
                        className="cancel-response"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) 
                : (
                  <button 
                    onClick={() => setEditingResponseId(feedback._id)}
                    className="add-response"
                  >
                    <FaReply /> Add Response
                  </button>
                )
              )}

              <button 
                onClick={() => deleteFeedback(feedback._id)}
                className="delete-feedback"
              >
                <FaTrash /> Delete
              </button>
            </div>
          ))
        ) : (
          <div className="no-feedback">No feedback found for this filter</div>
        )}
      </div>
    </div>
  );
};

export default ComplaintManagement;