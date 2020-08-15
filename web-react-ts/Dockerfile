FROM node:12

RUN mkdir -p /app
WORKDIR /app

COPY package.json .
RUN npm install
COPY . .

EXPOSE 3000

CMD ["npm", "start"]
