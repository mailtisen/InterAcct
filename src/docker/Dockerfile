#FROM ubuntu
#RUN apt-get update
#CMD ["echo","hi from TS Dockerfile"]
FROM ubuntu:18.04

ARG uid=1000

# Install environment for aries

RUN apt-get update -y && apt-get install -y \
	python3.5 \
	python3-pip \
	gnupg2 \
	curl \
	software-properties-common


RUN apt-key adv --no-tty --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys CE7709D068DB5E88 


RUN apt-add-repository "deb https://repo.sovrin.org/sdk/deb bionic master" -y


RUN apt-get update -y && apt-get install -y libindy indy-cli


RUN python3 -m pip install -U pip


RUN python3 -m pip install python3-indy aries-cloudagent

RUN curl -sL https://deb.nodesource.com/setup_12.x | bash

RUN apt-get install -y nodejs


