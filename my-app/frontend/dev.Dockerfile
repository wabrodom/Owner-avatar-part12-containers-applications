FROM node:20-alpine

WORKDIR /usr/src/app

COPY . .

# ENV VITE_BACKEND_URL=http://localhost:8888/api/
# localhost mean current computer, now it a container. 
#  but in this context, just hardcode backend url before build

# Change npm ci to npm install since we are going to be in development mode
RUN npm install

# npm start is the command to start the application in development mode
CMD ["npm", "run", "dev", "--", "--host"]