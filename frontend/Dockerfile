FROM node:slim 

WORKDIR /usr/src/app

COPY package*.json .

RUN --mount=type=cache,target=/root/.npm npm install

COPY . .

RUN chown -R node /usr/src/app

USER node

EXPOSE 5173

CMD [ "npm", "run", "dev" ]
