# The first FROM is now a stage called build-stage
FROM node:22-alpine AS build-stage

WORKDIR /usr/src/app

COPY --chown=node:node . .

ARG VITE_BACKEND_URL
ARG VITE_GRAPHQLWSLINK

ENV VITE_BACKEND_URL=${VITE_BACKEND_URL}
ENV VITE_GRAPHQLWSLINK=${VITE_GRAPHQLWSLINK}

RUN npm ci
RUN npm run test
RUN npm run build


# This is a new stage, everything before this is gone, except the files we want to COPY
FROM nginx:1.27-alpine AS production-stage

COPY --from=build-stage /usr/src/app/dist /usr/share/nginx/html

# CMD ["nginx", "-g", "daemon off;"]