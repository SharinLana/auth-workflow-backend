### Auth Workflow (Backend)

> An authentication and password resetting reference project. AccessToken and RefreshToken stored in cookies. PasswordToken.

#### Languages and Technologies Used:

- [] Node.js
- [] Express.js
- [] Mongoose
- [] MongoDB
- [] JsonWebToken
- [] Crypto

#### Functionalities:

- [] after registering, user is being asked to confirm the email address via a verification link
- [] verification link redirects the user to the login page where user can enter their credentials (email and password)
- [] if the credentals are incorrect, user receives a warning message and not being redirected to the website protected route
- [] user can set a new password if forgot the old one