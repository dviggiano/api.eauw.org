FROM node:16

WORKDIR /var/app

COPY package.json /var/app

RUN npm install --force --only=prod --ignore-scripts && npm cache clean --force

RUN npm install pm2 -g

COPY . /var/app

RUN npm run build

CMD [ "pm2-runtime", "dist/index.js" ]
