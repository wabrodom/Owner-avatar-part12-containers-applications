FROM node:22-alpine

WORKDIR /usr/src/app

COPY --chown=node:node . .


RUN npm install
# RUN npm uninstall bcrypt
# RUN npm install bcrypt

USER node
CMD ["npm", "run", "dev"]