FROM ubuntu:20.04

RUN apt-get update && apt-get -y install tree && tree -F /opt

COPY directory /opt/someplace

RUN tree -F /opt

COPY directory /opt/otherplace/

RUN tree -F /opt

COPY file /opt/here

RUN tree -F /opt

COPY file /opt/some/place/hidden/

RUN tree -F /opt

CMD tree -F /opt
