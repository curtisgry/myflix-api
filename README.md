# myflix-api

This is an API that contains movie data and user data for a React application.

## Table of contents

- [Overview](#overview)
  - [Links](#links)
  - [Built with](#built-with)
  - [What I learned](#what-i-learned)
- [Author](#author)

## Overview

The server-side component of a “movies” web application. The web
application will provide users with access to information about different
movies, directors, and genres. Users will be able to sign up, update their
personal information, and create a list of their favorite movies.

### What it does

Users are able to:

- Access data about movies to see data about genre, director, description, image links, and whether the movie is featured or not. 
- Create user account, log in, update account information, and delete their account.
- Add and remove movies to a users list of favorites.

### Links

- API Base URL: [https://myflix-api-cgray.herokuapp.com/](https://myflix-api-cgray.herokuapp.com/)
- Documentation: [Here](https://myflix-api-cgray.herokuapp.com/documentation)

### Built with

- Node.js
- Express
- MongoDB
- ES6
- Passport
- Mongoose

### What I learned

The advantages of JWTs for authentication and how to implement it with Passport.

- No session to manage and no cookies required.
- Good performance.
- One token can be used with more than one backend.
- Decoupled so the token can be gereated anywhere.

## Author

- Website - [Curtis Gray](https://curtisgry.github.io/portfolio-website/)
