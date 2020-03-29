# masterclass-mongo-express

1. Create package.json 
```
npm init
```
2. Install express and dotenv 
```
npm i express dotenv
```
3. Install nodemon as dev dependency
```
npm i -D nodemon
```
4. Update scripts section on package.json 
```
"scripts": {
    "start": "NODE_ENV=production node server",
    "dev": "nodemon server"
  }
```

