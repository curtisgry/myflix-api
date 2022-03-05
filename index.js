const bodyParser = require('body-parser');
const express = require('express');
const morgan = require('morgan');
const uuid = require('uuid');

const app = express();

const movieData = [
        {
                title: 'Interstellar',
                year: '2014',
                director: 'test',
                genre: 'scifi',
        },
        {
                title: 'Arrival',
                year: '2016',
                director: 'test',
                genre: 'scifi',
        },
        {
                title: 'The Matrix',
                year: '1999',
                director: 'test',
                genre: 'scifi',
        },
        {
                title: 'Star Wars: A New Hope',
                year: '1977',
                director: 'George Lucas',
                genre: 'scifi',
        },
        {
                title: 'Goodfellas',
                year: '1990',
                director: 'test',
                genre: 'test',
        },
        {
                title: 'Catch Me If You Can',
                year: '2002',
                director: 'test',
                genre: 'test',
        },
        {
                title: 'Spirited Away',
                year: '2001',
                director: 'test',
                genre: 'test',
        },
        {
                title: 'Good Will Hunting',
                year: '1997',
                director: 'test',
                genre: 'test',
        },
        {
                title: 'The Dark Knight',
                year: '2008',
                director: 'test',
                genre: 'test',
        },
        {
                title: 'The Truman Show',
                year: '1998',
                director: 'test',
                genre: 'test',
        },
];

const users = [
        {
                name: 'firstUser111',
                favoriteMovies: [
                        {
                                title: 'The Truman Show',
                                year: '1998',
                                director: 'test',
                                genre: 'test',
                        },
                ],
                id: '0b8b587e-9eff-4e55-a3a9-e203bc0980a5',
        },
        {
                name: 'secondUser111',
                favoriteMovies: [
                        {
                                title: 'The Truman Show',
                                year: '1998',
                                director: 'test',
                                genre: 'test',
                        },
                ],
                id: '0b8b587e-9eff-4e55-a3a9-e203bc0980a5',
        },
        {
                name: 'thirdUser111',
                favoriteMovies: [
                        {
                                title: 'The Truman Show',
                                year: '1998',
                                director: 'test',
                                genre: 'test',
                        },
                ],
                id: '0b8b587e-9eff-4e55-a3a9-e203bc0980a5',
        },
];

// Middleware
app.use(morgan('common'));
app.use(express.static('public'));
app.use(bodyParser.json());

app.get('/', (req, res) => {
        res.send('myFlix Movies API');
});

// READ
app.get('/movies', (req, res) => {
        res.json(movieData);
});
// READ
app.get('/movies/:title', (req, res) => {
        const { title } = req.params;
        const movieFound = movieData.find((movie) => movie.title.toLowerCase() === title.toLowerCase());
        if (movieFound) {
                res.status(200).json(movieFound);
        } else {
                res.status(400).send('Does not exist');
        }
});
// READ
app.get('/movies/genre/:genreName', (req, res) => {
        const { genreName } = req.params;
        const genreSelected = movieData.filter((movie) => movie.genre === genreName);
        if (genreSelected) {
                res.status(200).json(genreSelected);
        } else {
                res.status(400).send('Does not exist');
        }
});
// READ
app.get('/movies/directors/:directorName', (req, res) => {
        const { directorName } = req.params;
        const director = movieData.find((movie) => movie.director.toLowerCase() === directorName);

        if (director) {
                res.status(200).json(director);
        } else {
                res.status(400).send('Does not exist');
        }
});

// CREATE
app.post('/users', (req, res) => {
        const newUser = req.body;
        console.dir(req);
        if (newUser) {
                newUser.id = uuid.v4();
                users.push(newUser);
                res.status(201).json(newUser);
        } else {
                res.status(400).send('users need a name');
        }
});

// CREATE
app.post('/users/:userName/favorites', (req, res) => {
        const movie = req.body;
        const user = users.find((item) => item.name === req.params.userName);

        if (user && movie) {
                user.favoriteMovies.push(movie);
                res.status(201).json(user);
        } else {
                res.status(400).send('User does not exist, or no movie data was entered');
        }
});

// UPDATE
app.put('/users/:userName', (req, res) => {
        const { userName } = req.params;
        const newName = req.body;
        const userToUpdate = users.find((user) => user.name === userName);

        if (userToUpdate) {
                userToUpdate.name = newName.name;
                res.status(201).json(userToUpdate);
        } else {
                res.status(400).send('No user found');
        }
});

// DELETE
app.delete('/users/:userName/favorites/:favoriteTitle', (req, res) => {
        const { userName, favoriteTitle } = req.params;
        const user = users.find((user) => user.name === userName);
        const movieIsInList = user.favoriteMovies.find((item) => item.title.toLowerCase() === favoriteTitle);
        console.log(movieIsInList);
        if (user && movieIsInList) {
                const removeMovie = user.favoriteMovies.filter((movie) => movie.title.toLowerCase() !== favoriteTitle);
                user.favoriteMovies = removeMovie;
                res.status(200).send(`${favoriteTitle} has been removed`);
        } else {
                res.status(400).send('User or movie not found');
        }
});

// DELETE
app.delete('/users/:userName', (req, res) => {
        const { userName } = req.params;
        const userToRemove = users.find((user) => user.name === userName);
        const userIndex = users.indexOf(userToRemove);

        if (userToRemove) {
                users.splice(userIndex, 1);
                res.status(200).send(`The user: ${userName} has been removed`);
        } else {
                res.status(400).send('No user found');
        }
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

app.listen(8080, () => {
        console.log('Listening on port 8080');
});
