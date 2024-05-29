# Express application

Install dependencies with `npm install`

Run with `npm start`

Or in development mode with `npm run dev`

# Visit counter

When running the server, visit http://localhost:3000 to see visit counter, or give environment variable `PORT` to change the port.

# MongoDB

The application has /todos crud which requires a MongoDB. Pass connection url with env `MONGO_URL`

# Redis

Pass connection url with env `REDIS_URL`


---
---
---
ex.12.5 command used
```
docker build -t todo-backend . 
docker run -p 3000:3000 todo-backend
docker ps -a
docker kill ea33
docker ps -a
```

### note: 
flag -p host-port:application-port
