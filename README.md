# masterclass-mongo-express

1. Create package.json

```
npm init
```

2. Install dependencies:
   - Express: Node.js web application framework
   - Dotenv: zero-dependency module that loads environment variables from a .env file into process.env
   - Morgan: HTTP request logger middleware for node.js used to log morgan stream data
   - Mongoose: schema-based solution to model your application data
   - Colors: add colors to node.js console
   - Slugify: slugify module for node.js
   - Geocoder: geocoding library
   - File upload - express file sytem upload middleware

```
npm i express dotenv morgan mongoose colors slugify node-geocoder express-fileupload
```

3. Install nodemon as dev dependency

```
npm i -D nodemon
```

s

4. Update scripts section on package.json

```
"scripts": {
    "start": "NODE_ENV=production node server",
    "dev": "nodemon server"
  }
```
