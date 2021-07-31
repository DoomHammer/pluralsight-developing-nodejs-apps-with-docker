FROM node:15.14.0

COPY package.json yarn.lock .yarnrc /app/

WORKDIR /app

RUN yarn

COPY . /app/

RUN useradd -ms /bin/bash carvedrock && \
    chown carvedrock:carvedrock /app

USER carvedrock

CMD npx react-scripts start
