import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Image, Button, Badge, Alert, Spinner } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { getMovieById } from '../services/movieService';
import { isLoggedIn } from '../services/authService';
import ReviewForm from '../components/ReviewForm';
import ReviewList from '../components/ReviewList';

const MovieDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Default image if no image URL is provided
  const defaultImage = 'https://via.placeholder.com/500x750?text=No+Image';
  
  useEffect(() => {
    if (!isLoggedIn()) {
      navigate('/login');
      return;
    }
    
    fetchMovie();
  }, [id, navigate]);
  
  const fetchMovie = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await getMovieById(id, true);
      setMovie(response.movie);
    } catch (err) {
      setError('Failed to fetch movie details. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleReviewAdded = () => {
    // Refresh movie data to get updated reviews
    fetchMovie();
  };
  
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
  
  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }
  
  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">{error}</Alert>
        <Button variant="primary" onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </Container>
    );
  }
  
  if (!movie) {
    return (
      <Container className="mt-5">
        <Alert variant="warning">Movie not found.</Alert>
        <Button variant="primary" onClick={() => navigate('/')}>
          Back to Home
        </Button>
      </Container>
    );
  }
  
  return (
    <Container className="py-4">
      <Button variant="outline-secondary" className="mb-4" onClick={() => navigate(-1)}>
        ← Back
      </Button>
      
      <Row className="mb-5">
        <Col md={4} className="mb-4">
          <Image 
            src={movie.imageUrl || defaultImage} 
            alt={movie.title}
            fluid 
            rounded
            className="movie-detail-image"
          />
        </Col>
        
        <Col md={8}>
          <h1 className="mb-3">{movie.title}</h1>
          
          <div className="mb-3">
            <Badge bg="primary" className="me-2">{movie.genre}</Badge>
            <Badge bg="secondary">{movie.releaseDate}</Badge>
          </div>
          
          <div className="movie-rating mb-4">
            {movie.avgRating ? (
              <div className="d-flex align-items-center">
                <div className="me-2">
                  {renderStars(movie.avgRating)}
                </div>
                <span className="rating-text">
                  {movie.avgRating.toFixed(1)} / 5
                </span>
              </div>
            ) : (
              <span className="text-muted">No ratings yet</span>
            )}
          </div>
          
          <h3 className="mb-3">Cast</h3>
          {movie.actors && movie.actors.length > 0 ? (
            <ul className="actor-list">
              {movie.actors.map((actor, index) => (
                <li key={index}>
                  <strong>{actor.actorName}</strong> as {actor.characterName}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted">No cast information available.</p>
          )}
        </Col>
      </Row>
      
      <Row>
        <Col md={8}>
          {movie.movieReviews && (
            <ReviewList reviews={movie.movieReviews} />
          )}
        </Col>
        
        <Col md={4}>
          <ReviewForm movieId={movie._id} onReviewAdded={handleReviewAdded} />
        </Col>
      </Row>
    </Container>
  );
};

export default MovieDetailPage; 