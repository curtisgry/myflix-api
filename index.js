const bodyParser = require('body-parser');
const express = require('express');
const morgan = require('morgan');
const uuid = require('uuid');
const mongoose = require('mongoose');
const passport = require('passport');
const { check, validationResult } = require('express-validator');
const cors = require('cors');
const Models = require('./models.js');

// Mongoose models
const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect(process.env.CONNECTION_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
});

const app = express();

// CORS all domains allowed
app.use(cors());

// Middleware
app.use(morgan('common'));
app.use(express.static('public'));
app.use(bodyParser.json());

require('./passport');
const auth = require('./auth')(app);

app.get('/', (req, res) => {
        res.send('myFlix Movies API');
});

// Get list of all movies
app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
        Movies.find()
                .then((movies) => res.json(movies))
                .catch((err) => {
                        console.error(err);
                        res.status(500).send(`Error: ${err}`);
                });
});
// Get one movie by title
app.get('/movies/:Title', passport.authenticate('jwt', { session: false }), (req, res) => {
        Movies.find({ Title: req.params.Title })
                .then((movies) => res.json(movies))
                .catch((err) => {
                        console.error(err);
                        res.status(500).send(`Error: ${err}`);
                });
});
// Get movies by genre
app.get('/movies/genre/:GenreName', passport.authenticate('jwt', { session: false }), (req, res) => {
        Movies.find({ 'Genre.Name': req.params.GenreName })
                .then((movies) => res.json(movies))
                .catch((err) => {
                        console.error(err);
                        res.status(500).send(`Error: ${err}`);
                });
});

// Get movies by a director
app.get('/movies/directors/:DirectorName', passport.authenticate('jwt', { session: false }), (req, res) => {
        Movies.find({ 'Director.Name': req.params.DirectorName })
                .then((movies) => res.json(movies))
                .catch((err) => {
                        console.error(err);
                        res.status(500).send(`Error: ${err}`);
                });
});

// Get info on one director
app.get('/directors/:DirectorName', passport.authenticate('jwt', { session: false }), (req, res) => {
        Movies.find({ 'Director.Name': req.params.DirectorName })
                .then((movies) => {
                        const directorInfo = movies[0].Director;
                        res.json(directorInfo);
                })
                .catch((err) => {
                        console.error(err);
                        res.status(500).send(`Error: ${err}`);
                });
});

// Get list of all users
app.get('users', passport.authenticate('jwt', { session: false }), (req, res) => {
        Users.find()
                .then((users) => {
                        res.status(201).json(users);
                })
                .catch((err) => {
                        console.error(err);
                        res.status(500).send(`Error: ${err}`);
                });
});

// Get one user by username
app.get('users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
        Users.findOne({ Username: req.params.Username })
                .then((user) => {
                        res.json(user);
                })
                .catch((err) => {
                        console.error(err);
                        res.status(500).send(`Error: ${err}`);
                });
});

// Add a user
/* We’ll expect JSON in this format
{
  ID: Integer,
  Username: String,
  Password: String,
  Email: String,
  Birthday: Date
} */
app.post(
        '/users',
        [
                check('Username', 'Username is required').isLength({ min: 5 }),
                check('Username', 'Username contains non alphanumeric characters -not allowd.').isAlphanumeric(),
                check('Password', 'Password is required').not().isEmpty(),
                check('Email', 'Email does not appear to be valid').isEmail(),
        ],
        (req, res) => {
                // Check Validation object for errors
                const errors = validationResult(req);

                if (!errors.isEmpty()) {
                        return res.status(422).json({ errors: errors.array() });
                }

                const hashedPassword = Users.hashPassword(req.body.Password);
                Users.findOne({ Username: req.body.Username })
                        .then((user) => {
                                if (user) {
                                        return res.status(400).send(`${req.body.Username} already exists`);
                                }
                                Users.create({
                                        Username: req.body.Username,
                                        Password: hashedPassword,
                                        Email: req.body.Email,
                                        Birthday: req.body.Birthday,
                                })
                                        .then((user) => {
                                                res.status(201).json(user);
                                        })
                                        .catch((error) => {
                                                console.error(error);
                                                res.status(500).send(`Error: ${error}`);
                                        });
                        })
                        .catch((error) => {
                                console.error(error);
                                res.status(500).send(`Error: ${error}`);
                        });
        }
);

// Add a movie to a user's list of favorites
app.post(
        '/users/:Username/movies/:MovieID',
        [check('MovieID', 'Not a valid ID').isMongoId()],
        passport.authenticate('jwt', { session: false }),
        (req, res) => {
                // Check Validation object for errors
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                        return res.status(422).json({ errors: errors.array() });
                }
                Users.findOneAndUpdate(
                        { Username: req.params.Username },
                        {
                                $push: { FavoriteMovies: req.params.MovieID },
                        },
                        { new: true }
                )
                        .then((updatedUser) => res.json(updatedUser))
                        .catch((err) => {
                                console.error(err);
                                res.status(500).send(`Error: ${err}`);
                        });
        }
);

// Update a user's info, by username
/* We’ll expect JSON in this format
{
  Username: String,
  (required)
  Password: String,
  (required)
  Email: String,
  (required)
  Birthday: Date
} */
app.put(
        '/users/:Username',
        [
                check('Username', 'Username is required').isLength({ min: 5 }),
                check('Username', 'Username contains non alphanumeric characters -not allowd.').isAlphanumeric(),
                check('Password', 'Password is required').not().isEmpty(),
                check('Email', 'Email does not appear to be valid').isEmail(),
        ],
        passport.authenticate('jwt', { session: false }),
        (req, res) => {
                // Check Validation object for errors
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                        return res.status(422).json({ errors: errors.array() });
                }
                const hashedPassword = Users.hashPassword(req.body.Password);
                Users.findOneAndUpdate(
                        { Username: req.params.Username },
                        {
                                $set: {
                                        Username: req.body.Username,
                                        Password: hashedPassword,
                                        Email: req.body.Email,
                                        Birthday: req.body.Birthday,
                                },
                        },
                        { new: true }
                )
                        .then((updatedUser) => res.json(updatedUser))
                        .catch((err) => {
                                console.error(err);
                                res.status(500).send(`Error: ${err}`);
                        });
        }
);

// DELETE a favorite movie
app.delete(
        '/users/:Username/movies/:MovieID',
        [check('MovieID', 'Not a valid ID').isMongoId()],
        passport.authenticate('jwt', { session: false }),
        (req, res) => {
                // Check Validation object for errors
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                        return res.status(422).json({ errors: errors.array() });
                }
                Users.findOneAndUpdate(
                        { Username: req.params.Username },
                        {
                                $pull: { FavoriteMovies: req.params.MovieID },
                        },
                        { new: true }
                )
                        .then((updatedUser) => res.json(updatedUser))
                        .catch((err) => {
                                console.error(err);
                                res.status(500).send(`Error: ${err}`);
                        });
        }
);

// Delete a user by username
app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
        Users.findOneAndRemove({ Username: req.params.Username })
                .then((user) => {
                        if (!user) {
                                res.status(400).send(`${req.params.Username} was not found`);
                        } else {
                                res.status(200).send(`${req.params.Username} was deleted.`);
                        }
                })
                .catch((err) => {
                        console.error(err);
                        res.status(500).send(`Error: ${err}`);
                });
});

// Send documentation page
app.get('/documentation', (req, res) => {
        res.sendFile('public/documentation.html', { root: __dirname });
});

// Error handler
app.use((err, req, res, next) => {
        console.error(err.stack);
        res.status(500).send('Something went wrong');
});

const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
        console.log(`Listening on Port ${port}`);
});
