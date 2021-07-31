FROM node:15.14.0

LABEL version=1.0
LABEL maintainer="Piotr Gaczkowski"

WORKDIR /app

RUN npm install pg

COPY . /app/

RUN useradd -ms /bin/bash carvedrock && \
    chown carvedrock:carvedrock /app && \
    chmod +x /app/entrypoint.sh

USER carvedrock

ENTRYPOINT ["/app/entrypoint.sh"]

CMD node main.js
