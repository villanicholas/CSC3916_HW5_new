# MovieHub React Application

This is a React Single Page Application that interacts with the movie API. The application enables users to search for movies, display information about a selected movie, view stored ratings, and submit a new rating for a movie.

## Features

- User authentication (signup and login)
- Display top-rated movies on the main screen
- Search for movies by title or actor name
- View detailed movie information including cast, ratings, and reviews
- Submit reviews for movies

## Prerequisites

- Node.js and npm installed
- Movie API running on the backend

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd <repository-folder>/client
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the client directory and add your API URL:
   ```
   REACT_APP_API_URL=http://your-api-url.com
   ```
   Note: By default, the application will proxy requests to `http://localhost:8080`.

## Development

To start the development server:

```
npm start
```

This will run the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Building for Production

To build the application for production:

```
npm run build
```

This will create a `build` directory with the optimized, production-ready files.

## Deployment

### Deploying to Netlify

1. Create a Netlify account if you don't have one
2. Install Netlify CLI:
   ```
   npm install -g netlify-cli
   ```
3. Login to Netlify:
   ```
   netlify login
   ```
4. Deploy to Netlify:
   ```
   netlify deploy
   ```

### Deploying to Vercel

1. Install Vercel CLI:
   ```
   npm install -g vercel
   ```
2. Deploy to Vercel:
   ```
   vercel
   ```

### Deploying to Heroku

1. Install Heroku CLI
2. Login to Heroku:
   ```
   heroku login
   ```
3. Create a new Heroku app:
   ```
   heroku create your-app-name
   ```
4. Deploy to Heroku:
   ```
   git add .
   git commit -m "Deploy to Heroku"
   git push heroku main
   ```

## Important Notes

- Make sure your backend API is accessible from your deployed frontend application
- Update the CORS settings on your backend to allow requests from your frontend domain
- Set the appropriate environment variables on your deployment platform

## API Integration

The application communicates with the backend API using the following endpoints:

- `/signup` - Register a new user
- `/signin` - Authenticate a user and get a JWT token
- `/movies` - Get all movies (sorted by rating with `?reviews=true`)
- `/movies/:id` - Get a specific movie with its details
- `/movies/search` - Search for movies by title or actor name
- `/reviews` - Submit a movie review

## License

[MIT License](LICENSE)
