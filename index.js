const bodyParser = require('body-parser');
const express = require('express');
const morgan = require('morgan');

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

const users = [];

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
