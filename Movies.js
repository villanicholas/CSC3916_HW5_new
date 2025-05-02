var mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.connect(process.env.DB);

const genres = ['Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Mystery', 'Thriller', 'Western', 'Science Fiction'];

// Actor schema
var ActorSchema = new Schema({
    actorName: { type: String, required: true },
    characterName: { type: String, required: true }
});

// Movie schema
var MovieSchema = new Schema({
    title: { type: String, required: true, index: true },
    releaseDate: { type: Number, min: [1900, 'Must be greater than 1899'], max: [2100, 'Must be less than 2100']},
    genre: { type: String, enum: genres, required: true },
    actors: [ActorSchema],
    imageUrl: { type: String },
    avgRating: { type: Number, default: 0 }
});

// return the model
module.exports = mongoose.model('Movie', MovieSchema);