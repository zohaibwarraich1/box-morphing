FROM node:latest AS build

WORKDIR /app

COPY package*.json ./

RUN npm install --omit=dev

RUN npm install --save-dev eslint

COPY . ./

FROM node:18-alpine

WORKDIR /app

COPY --from=build /app /app

RUN npm run lint

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
