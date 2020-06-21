# syntax = docker/dockerfile:experimental

FROM node:12.18.0-alpine

WORKDIR /myapp
ENV TZ Asia/Tokyo

RUN yarn global add @vue/cli
COPY package.json yarn.lock /myapp/

RUN --mount=type=cache,target=/myapp/.cache/node_modules \
    yarn install --modules-folder .cache/node_modules && \
    cp -ar .cache/node_modules node_modules

COPY . /myapp

CMD ["yarn", "serve"]
