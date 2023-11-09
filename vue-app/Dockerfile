FROM node:lts

WORKDIR /app/vue-app

COPY ./pages_union/. .

RUN npm install

EXPOSE 8080

CMD ["npm", "run", "serve"]
