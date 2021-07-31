FROM node:15.14.0

LABEL version=1.0
LABEL maintainer="Piotr Gaczkowski"

COPY package.json package-lock.json /app/

WORKDIR /app

RUN npm install

COPY . /app/

RUN useradd -ms /bin/bash carvedrock && \
    chown carvedrock:carvedrock /app

USER carvedrock

CMD npm run start
