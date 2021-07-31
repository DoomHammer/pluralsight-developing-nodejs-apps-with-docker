FROM node:15.14.0

LABEL version=1.0
LABEL maintainer="Piotr Gaczkowski"

COPY package.json package-lock.json /usr/src/app/

WORKDIR /usr/src/app

RUN npm install

COPY . /usr/src/app/

RUN useradd -ms /bin/bash carvedrock && \
    chown carvedrock:carvedrock /usr/src/app

USER carvedrock

EXPOSE 9000

CMD npm run start