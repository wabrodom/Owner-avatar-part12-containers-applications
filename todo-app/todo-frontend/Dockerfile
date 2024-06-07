# The first FROM is now a stage called build-stage
FROM node:20 AS build-stage
WORKDIR /usr/src/app

COPY --chown=node:node . .

RUN npm ci
ENV VITE_BACKEND_URL=http://localhost:8888/api/
RUN npm run test
RUN npm run build


# This is a new stage, everything before this is gone, except the files we want to COPY
FROM nginx:1.25-alpine AS production-stage

# COPY the directory build from build-stage to /usr/share/nginx/html
# The target location here was found from the Docker hub page
COPY --chown=node:node --from=build-stage /usr/src/app/dist /usr/share/nginx/html
# COPY nginx.conf /etc/nginx/conf.d/default.conf:ro

USER node
# CMD ["nginx", "-g", "daemon off;"]

# found error in this file, back end build image and container are OK
# Error response from daemon: unable to find user node: no matching entries in passwd file