FROM balenalib/raspberry-pi-alpine-node:latest

ENV NODE_ENV=production
WORKDIR /usr/src/app

COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]

RUN install_packages graphicsmagick
RUN npm install --production --silent && mv node_modules ../

COPY . .
EXPOSE 80

CMD ["npm", "start"]
