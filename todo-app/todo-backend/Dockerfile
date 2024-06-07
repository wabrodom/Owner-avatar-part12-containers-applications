FROM node:20

WORKDIR /usr/src/app

COPY --chown=node:node . .


RUN npm ci
# VOLUME /data/db /data/configdb
USER node
CMD npm start