# Documentary-Songwriters

## About the project: ##

## Team Members: ##
Harsh Prajapati  
Isabelle Lai  
Peter Lam  
Rebecca Miller  
Yaqara Patterson  
Molly Campbell  
Will Kendall  
Yichen Wei  
Adam Peters  
Emily Liu  
Steven Song

## Setting up your development workspace: ##
### 1. Install postgres ###
    1. Mac users:
        1. Download homebrew: https://brew.sh/
        2. Enter the following command: brew install postgresql
    2. Window users:
        1. Download installer from here: https://www.enterprisedb.com/downloads/postgres-postgresql-downloads

    To use the default configuration, the password for SUPERUSER `postgres` should not be set, and you should create a 
    database called `dev`. Or, you can also change the database settings at `server/config/config.json`.
### 2. Install node.js ###
    1. Follow this tutorial: https://www.taniarascia.com/how-to-install-and-use-node-js-and-npm-mac-and-windows/
### 3. Clone the repository to your local computer ###
    1. https://github.com/JumboCode/Documentary-Songwriters
    2. Enter the following command: 
        1. git clone https://github.com/JumboCode/Documentary-Songwriters
### 4. Run the code ###
    0. cd into the repository
    1. Install dependencies: npm install
    2. Start server: npm start. Two servers will be set up, the client (frontend) side and the server (backend) side.
    3. Go to: http://localhost:3000/


## Deploying to heroku or production environment: ##
### Installation ###
#### Heroku
Heroku cli is needed if you are using heroku server. Please see their documentation on how to use it. To deploy, 
simply push to their repository.

#### Own server
- Please follow the same process as above to install nodejs and postgres.

- Install all packages
```
npm install
```

- Create a `.env` file with the following contents in both the client and server directories. The database config can be found at `server/config/config.json`

`server/.env`
```
DATABASE_URL=postgres://<username>@<host>:<port>/<database>
NODE_ENV=production
```

`client/.env`
```
NODE_ENV=production
```

- It is recommended and expected to compile the client script into static html in the production build.
The server will serve static html from `client/build` if the environment variable `NODE_ENV` is set to `production`.
To do this, run in the client directory

```
npm run-script build
```

- Run the server in the server directory
```
npm start
```

### Environment variables ###
| Variable                | Use                                                  | Example                                                                         | Default Value                                        |
|-------------------------|------------------------------------------------------|---------------------------------------------------------------------------------|------------------------------------------------------|
| `DATABASE_URL`          | The url of the postgres database                     | `postgres://user:pass@server:5432/dbname`                                       | <from `config.json` based on `NODE_ENV`>             |
| `NODE_ENV`              | Production or development server?                    | `production / development / test`                                               | `development`                                        |
| `GOOGLE_CLIENT_ID`      | Client ID for Google OAuth                           | `*.apps.googleusercontent.com`                                                  | `undefined`                                          |
| `GOOGLE_CLIENT_SECRET`  | Client secret for Google OAuth                       | `<secret key>`                                                                  | `undefined`                                          |
| `PW_HASH_ITERATIONS`    | The number of iterations for password bcrypt hashing | `10`                                                                            | `10`                                                 |
| `REACT_APP_SERVER_ADD`* | The hostname of the server                           | `example.com`, `*.herokuapp.com`                                                | `localhost:5000`                                     |
| `SERVER_ADD`*           | The hostname of the server (same as above)           | `example.com`, `*.herokuapp.com`                                                | `localhost:5000`                                     |
| `PORT`                  | The port of the server                               | `5000`. This should not be manually set on heroku, as they will set it for you. | `5000`                                               |
| `CLIENT_ADD`*           | The hostname of the client                           | `example.com`                                                                   | `SERVER_ADD` if it's set, otherwise `localhost:3000` |

\* Please note that neither server_add or client_add changes where the server is listening at. 
Instead, it tells the code where the server is listening at (for example, the client side will post the api request to `REACT_APP_SERVER_ADD`, etc). 
By default, the server will listen at `http://localhost:PORT`. To change what port the server is listening to, you need to change the `PORT` variable. To change the hostname where the server is listening to or allow traffic from the network, a proxy server like `nginx` is recommended. Alternatively you may update the code at `index.js`.

#### How to store or use these variables
To ensure a safe production environment, those variables that contain passwords are not recommended to be stored in config files. 

If you are using heroku or similar services, please add those environment variables to the heroku server configuration.

If you are using your own server, there are two ways to achieve this:
- Add `.env` file and the `dotenv` package. See `https://github.com/motdotla/dotenv`.
- When running or building the program, prepend all the environment variables:
```
NODE_ENV=production SERVER_ADD="localhost:5000" ... npm start
NODE_ENV=production SERVER_ADD="localhost:5000" ... npm run-script build
```
