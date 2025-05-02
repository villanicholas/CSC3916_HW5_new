import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';

const ReviewList = ({ reviews }) => {
  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center p-4">
        <p className="text-muted">No reviews yet. Be the first to review!</p>
      </div>
    );
  }

  // Helper to render stars based on rating
  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, index) => {
      if (index < Math.floor(rating)) {
        return <i key={index} className="fas fa-star text-warning"></i>;
      } else if (index === Math.floor(rating) && rating % 1 > 0) {
        return <i key={index} className="fas fa-star-half-alt text-warning"></i>;
      } else {
        return <i key={index} className="far fa-star text-warning"></i>;
      }
    });
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="reviews-container">
      <h3 className="mb-3">Reviews ({reviews.length})</h3>
      
      {reviews.map((review, index) => (
        <Card key={index} className="mb-3">
          <Card.Body>
            <Row>
              <Col md={8}>
                <div className="d-flex align-items-center mb-2">
                  <div className="review-avatar me-2">
                    <i className="fas fa-user-circle fa-2x text-secondary"></i>
                  </div>
                  <div>
                    <h5 className="mb-0">{review.username}</h5>
                    <small className="text-muted">
                      {review.createdAt && formatDate(review.createdAt)}
                    </small>
                  </div>
                </div>
                <p className="review-text">{review.review}</p>
              </Col>
              <Col md={4} className="text-md-end">
                <div className="mb-2">
                  {renderStars(review.rating)}
                </div>
                <div className="rating-value">
                  <span className="badge bg-primary">{review.rating}/5</span>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
};

export default ReviewList; 