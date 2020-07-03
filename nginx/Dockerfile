FROM nginx:1.19.0-alpine as develop
RUN rm -f /etc/nginx/conf.d/*
COPY nginx.dev.conf /etc/nginx/conf.d/myapp.conf
CMD /usr/sbin/nginx -g 'daemon off;' -c /etc/nginx/nginx.conf

FROM node:12.18.0-alpine as build-stage
WORKDIR /myapp
RUN yarn global add @vue/cli
COPY frontend/package.json frontend/yarn.lock /myapp/
RUN yarn install

COPY frontend /myapp
RUN yarn build

FROM nginx:1.19.0-alpine as production
RUN mkdir /myapp
COPY --from=build-stage /myapp/dist /myapp/public

RUN rm -f /etc/nginx/conf.d/*
COPY nginx/nginx.conf /etc/nginx/conf.d/myapp.conf
CMD /usr/sbin/nginx -g 'daemon off;' -c /etc/nginx/nginx.conf

# ビルドコマンド docker buildx build -t punct_web:production -f nginx/Dockerfile .
