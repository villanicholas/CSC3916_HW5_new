import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { getMovies, searchMovies } from '../services/movieService';
import { isLoggedIn } from '../services/authService';
import MovieCard from '../components/MovieCard';
import { useNavigate } from 'react-router-dom';

const HomePage = ({ searchQuery }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const navigate = useNavigate();
  
  // Fetch movies on component mount
  useEffect(() => {
    if (!isLoggedIn()) {
      navigate('/login');
      return;
    }
    
    fetchMovies();
  }, [navigate]);
  
  // Handle incoming search query from navbar
  useEffect(() => {
    if (searchQuery && searchQuery.trim() !== '') {
      handleSearch(searchQuery);
    }
  }, [searchQuery]);
  
  const fetchMovies = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getMovies(true);
      setMovies(response.movies || []);
    } catch (err) {
      setError('Failed to fetch movies. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSearch = async (term) => {
    setSearchTerm(term);
    setSearching(true);
    setLoading(true);
    setError('');
    
    try {
      const response = await searchMovies(term);
      setMovies(response.movies || []);
    } catch (err) {
      setError('Failed to search movies. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
      setSearching(true);
    }
  };
  
  const clearSearch = () => {
    setSearchTerm('');
    setSearching(false);
    fetchMovies();
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
  
  return (
    <Container>
      {error && <Alert variant="danger">{error}</Alert>}
      
      <div className="mb-4">
        <h1 className="mb-2">
          {searching 
            ? `Search Results for "${searchTerm}"` 
            : 'Top Rated Movies'}
        </h1>
        
        {searching && (
          <button 
            className="btn btn-link p-0"
            onClick={clearSearch}
          >
            ← Back to all movies
          </button>
        )}
      </div>
      
      {movies.length === 0 ? (
        <div className="text-center mt-5">
          <p>No movies found. {searching && 'Try a different search term.'}</p>
        </div>
      ) : (
        <Row xs={1} md={2} lg={4} className="g-4">
          {movies.map((movie) => (
            <Col key={movie._id}>
              <MovieCard movie={movie} />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default HomePage; 