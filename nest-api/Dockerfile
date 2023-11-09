FROM node:lts

WORKDIR /app/nest-api
RUN apt-get update && apt-get -y install postgresql

COPY ./ft_transcendence_db/. .

RUN npm install

EXPOSE 3000

CMD ["npm", "run", "start:dev"]
