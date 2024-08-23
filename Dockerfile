FROM node:22.5.1 as base

WORKDIR /app

COPY package*.json ./

RUN yarn install

COPY . .

RUN yarn build


FROM base as api

WORKDIR /app

EXPOSE 3000

CMD [ "npm", "start" ]


FROM base as worker

WORKDIR /app

CMD [ "npm", "run", "start-worker" ]