# The first FROM is now a stage called build-stage
FROM node:20 AS build-stage
WORKDIR /usr/src/app

# COPY --chown=node:node . .
COPY . .

RUN npm ci
ENV VITE_BACKEND_URL=http://localhost:8888/api/
RUN npm run test
RUN npm run build


# This is a new stage, everything before this is gone, except the files we want to COPY
FROM nginx:1.27-alpine AS production-stage

COPY --from=build-stage /usr/src/app/dist /usr/share/nginx/html

# COPY ./nginx.conf /etc/nginx/nginx.conf:ro
# CMD ["nginx", "-g", "daemon off;"]