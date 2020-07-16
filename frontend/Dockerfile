# syntax = docker/dockerfile:experimental

FROM node:12.18.0-alpine

WORKDIR /myapp
ENV TZ Asia/Tokyo
ENV VUE_APP_API_URL http://localhost/api/

COPY package.json yarn.lock /myapp/

RUN --mount=type=cache,target=/myapp/.cache/node_modules \
    yarn install --modules-folder .cache/node_modules && \
    cp -ar .cache/node_modules node_modules

COPY . /myapp

CMD ["yarn", "serve"]
