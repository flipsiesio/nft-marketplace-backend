FROM node:18-alpine as builder
WORKDIR /app

RUN  yarn global add @nestjs/cli

COPY *.json ./
RUN yarn install

COPY . .

ARG SERVICES
# RUN for service in $SERVICES; do nest build $service; done

RUN set -eu; \
        for service in $SERVICES; \
    do \
        echo "Service: " $service; \
        yarn build $service; \
        echo "Build" $service; \
    done;

FROM node:18-alpine as executor
WORKDIR /app
COPY --from=builder /app .
