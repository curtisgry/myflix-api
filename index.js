const express = require('express');
const morgan = require('morgan');

const app = express();

const movieData = [
        {
                title: 'Interstellar',
                year: '2014',
        },
        {
                title: 'Arrival',
                year: '2016',
        },
        {
                title: 'The Matrix',
                year: '1999',
        },
        {
                title: 'Star Wars: A New Hope',
                year: '1977',
        },
        {
                title: 'Goodfellas',
                year: '1990',
        },
        {
                title: 'Catch Me If You Can',
                year: '2002',
        },
        {
                title: 'Spirited Away',
                year: '2001',
        },
        {
                title: 'Good Will Hunting',
                year: '1997',
        },
        {
                title: 'The Dark Knight',
                year: '2008',
        },
        {
                title: 'The Truman Show',
                year: '1998',
        },
];

// Middleware
app.use(morgan('common'));
app.use(express.static('public'));

app.get('/', (req, res) => {
        res.send('myFlix Movies API');
});

// Get the movies as JSON data
app.get('/movies', (req, res) => {
        res.json(movieData);
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
