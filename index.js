const express = require('express');
const morgan = require('morgan');

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

const app = express();

app.use(morgan('common'));

app.get('/movies', (req, res) => {});
