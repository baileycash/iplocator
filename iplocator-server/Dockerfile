FROM node:20-alpine

ENV NODE_ENV development

WORKDIR /usr/src/app

COPY . .

RUN npm install
RUN npm run build

EXPOSE 5000
CMD [ "npm", "start" ]