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

# FROM cypress/browsers:node12.18.0-chrome83-ff77 as cypress
FROM cypress/base:12.18.0 as cypress

WORKDIR /myapp
ENV TZ Asia/Tokyo

COPY package.json yarn.lock /myapp/
RUN yarn install

COPY . /myapp
