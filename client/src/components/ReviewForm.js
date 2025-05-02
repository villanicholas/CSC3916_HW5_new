import React, { useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { addReview } from '../services/reviewService';

const ReviewForm = ({ movieId, onReviewAdded }) => {
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const reviewData = {
        movieId,
        rating: parseInt(rating),
        review
      };

      await addReview(reviewData);
      setSuccess('Review submitted successfully!');
      setReview('');
      setRating(5);
      
      // Notify parent component
      if (onReviewAdded) {
        onReviewAdded();
      }
    } catch (err) {
      setError(err.message || 'Failed to submit review. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="review-form-container p-3 border rounded">
      <h3>Write a Review</h3>
      
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Rating</Form.Label>
          <Row>
            <Col xs="auto">
              <Form.Select 
                value={rating} 
                onChange={(e) => setRating(e.target.value)}
                required
              >
                <option value="5">5 - Excellent</option>
                <option value="4">4 - Very Good</option>
                <option value="3">3 - Good</option>
                <option value="2">2 - Fair</option>
                <option value="1">1 - Poor</option>
              </Form.Select>
            </Col>
            <Col>
              <div className="rating-stars mt-2">
                {[...Array(5)].map((_, i) => (
                  <i 
                    key={i} 
                    className={i < rating ? "fas fa-star text-warning" : "far fa-star text-warning"}
                  ></i>
                ))}
              </div>
            </Col>
          </Row>
        </Form.Group>
        
        <Form.Group className="mb-3">
          <Form.Label>Your Review</Form.Label>
          <Form.Control 
            as="textarea" 
            rows={4} 
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Write your review here..."
            required
          />
        </Form.Group>
        
        <Button 
          variant="primary" 
          type="submit" 
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit Review'}
        </Button>
      </Form>
    </div>
  );
};

export default ReviewForm; 