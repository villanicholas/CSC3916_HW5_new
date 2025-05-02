import React from 'react';
import { Card, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../styles/MovieCard.css';

const MovieCard = ({ movie }) => {
  // Default image if no image URL is provided
  const defaultImage = 'https://via.placeholder.com/300x450?text=No+Image';
  
  const renderRating = () => {
    if (movie.avgRating) {
      // Display stars based on rating
      const stars = Array(5).fill(0).map((_, index) => {
        if (index < Math.floor(movie.avgRating)) {
          return <i key={index} className="fas fa-star text-warning"></i>;
        } else if (index === Math.floor(movie.avgRating) && movie.avgRating % 1 > 0) {
          return <i key={index} className="fas fa-star-half-alt text-warning"></i>;
        } else {
          return <i key={index} className="far fa-star text-warning"></i>;
        }
      });
      
      return (
        <div className="d-flex align-items-center">
          <div className="me-2">{stars}</div>
          <span>({movie.avgRating.toFixed(1)})</span>
        </div>
      );
    }
    
    return <span className="text-muted">No ratings yet</span>;
  };
  
  return (
    <Card className="movie-card h-100">
      <Link to={`/movies/${movie._id}`} className="movie-link">
        <Card.Img 
          variant="top" 
          src={movie.imageUrl || defaultImage} 
          alt={movie.title}
          className="movie-poster"
        />
      </Link>
      <Card.Body>
        <Link to={`/movies/${movie._id}`} className="text-decoration-none">
          <Card.Title className="movie-title">{movie.title}</Card.Title>
        </Link>
        <div className="mb-2">
          <Badge bg="primary">{movie.genre}</Badge>{' '}
          <Badge bg="secondary">{movie.releaseDate}</Badge>
        </div>
        <div className="movie-rating">
          {renderRating()}
        </div>
      </Card.Body>
    </Card>
  );
};

export default MovieCard; 