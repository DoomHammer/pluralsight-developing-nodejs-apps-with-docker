FROM ubuntu:20.04

RUN apt-get update && apt-get -y install tree && tree -F /opt

ADD https://raw.githubusercontent.com/DoomHammer/pluralsight-opensource-your-project-on-github/master/README.md /opt/here

RUN tree -F /opt

ADD surprise.tar.gz /opt/someplace

RUN tree -F /opt

ADD https://github.com/DoomHammer/pluralsight-developing-nodejs-apps-with-docker/files/6335515/surprise.tar.gz /opt/otherplace

RUN tree -F /opt

COPY surprise.tar.gz /opt/some/place/hidden/

RUN tree -F /opt

CMD tree -F /opt
