# syntax = docker/dockerfile:experimental

FROM node:12.18.0-alpine as develop

WORKDIR /myapp
ENV TZ Asia/Tokyo
ENV VUE_APP_API_URL http://localhost/api/

RUN yarn global add @vue/cli
COPY package.json yarn.lock /myapp/

RUN --mount=type=cache,target=/myapp/.cache/node_modules \
    yarn install --modules-folder .cache/node_modules && \
    cp -ar .cache/node_modules node_modules

COPY . /myapp

CMD ["yarn", "serve"]

FROM cypress/base:12.18.0 as e2e

WORKDIR /myapp
ENV TZ Asia/Tokyo
ENV CYPRESS_API_HOST web
ENV CYPRESS_baseUrl http://web
RUN npm install -g wait-on

COPY package.json yarn.lock /myapp/
RUN yarn install

COPY . /myapp
