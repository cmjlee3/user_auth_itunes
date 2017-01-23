# Itunes CRUD with user auth

## About
Made by combining [itunes_crud_lab](https://git.generalassemb.ly/wdi-nyc-60/itunes_crud_lab/tree/solution-a)
with [express_user_auth_template](https://git.generalassemb.ly/wdi-nyc-60/express_user_auth_template)

### How do you integrate user auth into an existing project?
Easy, we gave you the template in a bare bones application called `express_user_auth_template` (link above). Ok, maybe it's not _super_ straight forward, but everything you will need is in there. Let's explore the important parts and the roles they play:
  - `lib/` directory contains some useful modules used in the user auth
    * `dbConnect.js` is where we are able to configure our Mongo database in a single location so we don't have to do it in _every single_ model we're connecting to our DB. It gives us the function `getDB`, which we are able to use like: 

    ```javascript
    function getFavorites(req, res, next) {
      // find all favorites for your userId
      getDB().then((db) => {
        db.collection('favorites')
          .find({ userId: { $eq: req.session.userId } })
          .toArray((toArrErr, data) => {
            if(toArrErr) return next(toArrErr);
            res.favorites = data;
            db.close();
            next();
          });
          return false;
      });
      return false;
    }
    ```
    > using the line `getDB().then((db) => {`
    is the equivalent of `MongoClient.connect(DB_CONNECTION, (err, db) => {`
    
    * `auth.js` contains our authenication methods using an encryption algorithm called `bcrypt` (not important for now, we'll get into this more with SQL databases). This file exports 2 methods:
      - `logIn` middleware function to be used in the route that takes your login form's `post` of login info and then stores the userId in our `req.session`
      - `authenticate` middleware function to be used to protect _any_ routes that should only be seen by a user that is successfully logged in.
  
  - `models/user.js` model contains all of the middleware needed to interact with the user:
    * `createUser` used in route that handles's the user's sign up form's post method. This method creates a user record in our database with an encrypted password
    * `getUserById` is used throughout our application **only** after the user has been logged in. Since we are only storing our user's `userId` in our session, we use this method to retreive our all of our user's information using the ID.
    * `getUserByUsername` is used throughout our application **only** after the user has been logged in. It is currently not being used in this application at the moment, but like the `getUserById` it allows your to retreive user information from our database with the username.

  - `routes/`
    * `users.js` contains 2 routes, a post to create the user with our `createUser` middleware, and a get route to bring us to our user's profile _if and only if_ it passes the `authenticate` middleware
    * `auth.js` contains a post that handles handles the login form, and a delete that is used to log our user's out
    
