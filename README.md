# Documentary-Songwriters
## About the project: ##

## Team Members: ##
Harsh Prajapati  
Isabelle Lai  
Peter Lam  
Rebecca Miller  

## Setting up your workspace: ##
1. Download postgres (this will be how we will be interacting with the database)
    1. Download homebrew: https://brew.sh/
    2. Enter the following command:
        1.  brew install postgresql
    3. Enter into postgres: $ psql postgres 
    4. Create a user: postgres=# CREATE ROLE me WITH LOGIN PASSWORD 'password'; 
    5. Allow user "me" to have new permissions: postgres=# ALTER ROLE me CREATEDB;
    6. Create a "jumbocode" database under user "me": postgres=# \q (quiting) --> psql -d postgres -U me (re-enter) --> postgres=> CREATE DATABASE jumbocode;
    7. Connect to database: postgres=> \c jumbocode
    8. Create a table in the database: jumbocode=>
                                        CREATE TABLE users (
                                        personid INT PRIMARY KEY,
                                        lastname VARCHAR(30),
                                        firstname VARCHAR(30),
                                        instrument VARCHAR(30)
                                        );
    1. Mac users: 
        1. Download homebrew: https://brew.sh/
        2. Enter the following command: brew install postgresql
    2. Window users: 
        1. Follow this tutorial: https://www.enterprisedb.com/downloads/postgres-postgresql-downloads
2. Download node.js 
    1. Follow this tutorial: https://www.taniarascia.com/how-to-install-and-use-node-js-and-npm-mac-and-windows/
3. Clone to the repository to your local computer
    1. https://github.com/JumboCode/Documentary-Songwriters
    2. Enter the following command: 
        1. git clone https://github.com/JumboCode/Documentary-Songwriters
4. cd into the file Documentary-Songwriters 
    1. Run the command node index.js 
    2. Go to any browser and enter http://localhost:3000/

