# MTG Collection Manager
A React web application that functions as a card management system. Providing users with the ability to search, filter, edit, and add cards to their decks. Additionally, the system offers a dashboard with analytics to enable users to understand their card collection.
# What I Learned
- PostgreSQL, Express, React, Node.js - PERN Stack
- Designed and developed a RESTful API resulting to increase data processing speed and reduce API response time
- Component-Base Structure + SPA with React to reduce strain on server and load times
- OAuth 2.0 authentication and authorization with JWT
- AWS deployment with Ubuntu and EC2
- Continuous Integration/Continuous Deployment (CI/CD), automated testing and deployment
# How to use
Visit [Website](https://www.mtgcollectionmanager.com/) and explore  
    
OR    
    
Download file and install [Postgres](https://www.postgresql.org/download/)    
[Create postgres user and database(mtg)](https://medium.com/coding-blocks/creating-user-database-and-adding-access-on-postgresql-8bfcd2f4a91e)   

Creates .env file and fill in you credientals
```
PORT = 5000

PGUSER="postgres"
PGPASSWORD= "password"
PGHOST= "localhost"
PGPORT= 5432
PGDATABASE= "mtg"

SECRETKEY = "secretkey"
REFRESHSECRETKEY = "refreshsecretkey"
```
Go to server directory and install packages
```
npm install
```
Start server
```
npm start
```
Go to client directory and install packages
```
npm install
```
Start client
```
npm start
```
Vist `http://localhost:3000` and explore
