var mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.connect(process.env.DB);

// Review schema
var ReviewSchema = new Schema({
    movieId: { type: Schema.Types.ObjectId, ref: 'Movie', required: true },
    username: { type: String, required: true },
    review: { type: String, required: true },
    rating: { 
        type: Number, 
        required: true,
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating must be at most 5']
    },
    createdAt: { type: Date, default: Date.now }
});

// return the model
module.exports = mongoose.model('Review', ReviewSchema);