/*
CSC3916 HW4
File: Server.js
Description: Web API scaffolding for Movie API
 */

var express = require('express');
var bodyParser = require('body-parser');
var passport = require('passport');
var authController = require('./auth');
var authJwtController = require('./auth_jwt');
var jwt = require('jsonwebtoken');
var cors = require('cors');
var User = require('./Users');
var Movie = require('./Movies');
var Review = require('./Reviews');
var crypto = require('crypto');
var request = require('request-promise');

var app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(passport.initialize());

var router = express.Router();

const GA_TRACKING_ID = process.env.GA_KEY;

// Google Analytics tracking function
async function trackEvent(movieName, genre, path) {
    const options = {
        method: 'POST',
        uri: 'https://www.google-analytics.com/collect',
        qs: {
            v: '1',
            tid: GA_TRACKING_ID,
            cid: crypto.randomBytes(16).toString('hex'),
            t: 'event',
            ec: genre,
            ea: path,
            el: 'API Request for Movie Review',
            ev: '1',
            cd1: movieName,
            cm1: '1'
        }
    };

    try {
        await request(options);
    } catch (error) {
        console.error('Error tracking analytics:', error);
    }
}

function getJSONObjectForMovieRequirement(req) {
    var json = {
        headers: "No headers",
        key: process.env.UNIQUE_KEY,
        body: "No body"
    };

    if (req.body != null) {
        json.body = req.body;
    }

    if (req.headers != null) {
        json.headers = req.headers;
    }

    return json;
}

// Movies endpoints
router.route('/movies')
    .get(authJwtController.isAuthenticated, function (req, res) {
        if (req.query.reviews === 'true') {
            Movie.aggregate([
                {
                    $lookup: {
                        from: 'reviews',
                        localField: '_id',
                        foreignField: 'movieId',
                        as: 'movieReviews'
                    }
                },
                {
                    $addFields: {
                        avgRating: { $avg: '$movieReviews.rating' }
                    }
                },
                {
                    $sort: { avgRating: -1 }
                }
            ]).exec(function (err, movies) {
                if (err) {
                    return res.status(500).json({ success: false, message: 'Error getting movies with reviews.' });
                }
                res.json({ success: true, movies: movies });
            });
        } else {
            Movie.find(function (err, movies) {
                if (err) {
                    return res.status(500).json({ success: false, message: 'Error getting movies.' });
                }
                res.json({ success: true, movies: movies });
            });
        }
    })
    .post(authJwtController.isAuthenticated, function (req, res) {
        if (!req.body.title || !req.body.releaseDate || !req.body.genre || !req.body.actors) {
            return res.json({ success: false, message: 'Please provide all required fields.' });
        }

        var movie = new Movie();
        movie.title = req.body.title;
        movie.releaseDate = req.body.releaseDate;
        movie.genre = req.body.genre;
        movie.actors = req.body.actors;
        movie.imageUrl = req.body.imageUrl;

        movie.save(function (err) {
            if (err) {
                return res.json({ success: false, message: 'Error saving movie.' });
            }
            res.json({ success: true, message: 'Movie created!' });
        });
    });

// Search endpoint for movies
router.post('/movies/search', authJwtController.isAuthenticated, function(req, res) {
    const searchTerm = req.body.searchTerm;
    if (!searchTerm) {
        return res.status(400).json({ success: false, message: 'Search term is required' });
    }

    Movie.aggregate([
        {
            $lookup: {
                from: 'reviews',
                localField: '_id',
                foreignField: 'movieId',
                as: 'movieReviews'
            }
        },
        {
            $addFields: {
                avgRating: { $avg: '$movieReviews.rating' }
            }
        },
        {
            $match: {
                $or: [
                    { title: { $regex: searchTerm, $options: 'i' } },
                    { 'actors.actorName': { $regex: searchTerm, $options: 'i' } }
                ]
            }
        },
        {
            $sort: { avgRating: -1 }
        }
    ]).exec(function(err, movies) {
        if (err) {
            return res.status(500).json({ success: false, message: 'Error searching movies.' });
        }
        res.json({ success: true, movies: movies });
    });
});

router.route('/movies/:id')
    .get(authJwtController.isAuthenticated, function (req, res) {
        if (req.query.reviews === 'true') {
            Movie.aggregate([
                {
                    $match: { _id: mongoose.Types.ObjectId(req.params.id) }
                },
                {
                    $lookup: {
                        from: 'reviews',
                        localField: '_id',
                        foreignField: 'movieId',
                        as: 'movieReviews'
                    }
                },
                {
                    $addFields: {
                        avgRating: { $avg: '$movieReviews.rating' }
                    }
                }
            ]).exec(function (err, movie) {
                if (err) {
                    return res.status(500).json({ success: false, message: 'Error getting movie with reviews.' });
                }
                if (!movie || movie.length === 0) {
                    return res.status(404).json({ success: false, message: 'Movie not found.' });
                }
                res.json({ success: true, movie: movie[0] });
            });
        } else {
            Movie.findById(req.params.id, function (err, movie) {
                if (err) {
                    return res.status(500).json({ success: false, message: 'Error getting movie.' });
                }
                if (!movie) {
                    return res.status(404).json({ success: false, message: 'Movie not found.' });
                }
                res.json({ success: true, movie: movie });
            });
        }
    });

// Reviews endpoints
router.route('/reviews')
    .post(authJwtController.isAuthenticated, function (req, res) {
        if (!req.body.movieId || !req.body.review || !req.body.rating) {
            return res.json({ success: false, message: 'Please provide all required fields.' });
        }

        Movie.findById(req.body.movieId, function (err, movie) {
            if (err || !movie) {
                return res.status(404).json({ success: false, message: 'Movie not found.' });
            }

            var review = new Review();
            review.movieId = req.body.movieId;
            review.username = req.user.username;
            review.review = req.body.review;
            review.rating = req.body.rating;

            review.save(function (err) {
                if (err) {
                    return res.json({ success: false, message: 'Error saving review.' });
                }

                // Update movie's average rating
                Review.aggregate([
                    { $match: { movieId: req.body.movieId } },
                    { $group: { _id: null, avgRating: { $avg: '$rating' } } }
                ]).exec(function(err, result) {
                    if (!err && result.length > 0) {
                        Movie.findByIdAndUpdate(req.body.movieId, 
                            { avgRating: result[0].avgRating },
                            { new: true },
                            function(err, updatedMovie) {
                                if (err) {
                                    console.error('Error updating movie rating:', err);
                                }
                            }
                        );
                    }
                });

                // Track the review in Google Analytics
                trackEvent(movie.title, movie.genre, '/reviews')
                    .then(() => {
                        res.json({ success: true, message: 'Review created!' });
                    })
                    .catch(() => {
                        res.json({ success: true, message: 'Review created!' });
                    });
            });
        });
    });

router.post('/signup', function(req, res) {
    if (!req.body.username || !req.body.password || !req.body.name) {
        res.json({success: false, msg: 'Please include name, username, and password to signup.'})
    } else {
        var user = new User();
        user.name = req.body.name;
        user.username = req.body.username;
        user.password = req.body.password;

        user.save(function(err){
            if (err) {
                if (err.code == 11000)
                    return res.json({ success: false, message: 'A user with that username already exists.'});
                else
                    return res.json(err);
            }

            res.json({success: true, msg: 'Successfully created new user.'})
        });
    }
});

router.post('/signin', function (req, res) {
    var userNew = new User();
    userNew.username = req.body.username;
    userNew.password = req.body.password;

    User.findOne({ username: userNew.username }).select('name username password').exec(function(err, user) {
        if (err) {
            res.send(err);
        }

        user.comparePassword(userNew.password, function(isMatch) {
            if (isMatch) {
                var userToken = { id: user.id, username: user.username };
                var token = jwt.sign(userToken, process.env.SECRET_KEY);
                res.json ({success: true, token: 'JWT ' + token});
            }
            else {
                res.status(401).send({success: false, msg: 'Authentication failed.'});
            }
        })
    })
});

app.use('/', router);
app.listen(process.env.PORT || 8080);
module.exports = app; // for testing only


