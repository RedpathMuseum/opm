FROM alpine:3.6


RUN apk update && \
    apk upgrade && \
    apk --update add \
        gcc \
        g++ \
        build-base \
        cmake \
        git \
        bash \
        libstdc++ && \
    rm -rf /var/cache/apk/*

RUN git clone https://github.com/google/draco.git; \
    pwd; \
    ls; \
    mkdir draco_build; \
    ls; \
    cd draco_build; \
    cmake ../draco; \
    make; \
    ls; \
    cd /draco; \
    mkdir objPool; \
    cd ..;

VOLUME ["/project/draco"]
WORKDIR ["/draco"]

CMD ["/draco/draco_encoder", "-h"]



