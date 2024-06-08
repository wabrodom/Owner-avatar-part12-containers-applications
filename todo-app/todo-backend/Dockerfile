FROM node:20 AS build-stage

WORKDIR /usr/src/app

COPY --chown=node:node . .

RUN npm ci --omit=dev
# VOLUME /data/db /data/configdb


FROM node:20-alpine AS production-stage

WORKDIR /usr/src/app

COPY --from=build-stage /usr/src/app ./

USER node
CMD ["npm", "start"]
