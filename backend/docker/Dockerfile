FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y \
  python3 python3-pip \
  nodejs npm \
  openjdk-17-jdk \
  gcc g++ \
  curl git \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /workspace

CMD ["bash"]
