FROM node:15.14.0

LABEL version=1.0
LABEL maintainer="Piotr Gaczkowski"

WORKDIR /app

RUN npm install pg

COPY . /app/

RUN useradd -ms /bin/bash carvedrock && \
    chown carvedrock:carvedrock /app

USER carvedrock

CMD node main.js
