FROM lambci/lambda:build-nodejs12.x

WORKDIR /app/

COPY package.json package-lock.json /app/

RUN npm ci --silent

COPY . .

CMD npm start