FROM nginx:1.19.0-alpine as develop
RUN rm -f /etc/nginx/conf.d/*
COPY nginx.dev.conf /etc/nginx/conf.d/myapp.conf
CMD /usr/sbin/nginx -g 'daemon off;' -c /etc/nginx/nginx.conf

FROM node:12.18.0-alpine as build-stage
WORKDIR /myapp
ENV TZ Asia/Tokyo
ENV VUE_APP_API_URL https://punct.work/api/

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

FROM node:12.18.0-alpine as e2e-build-stage
WORKDIR /myapp
ENV TZ Asia/Tokyo
ENV VUE_APP_API_URL http://web/api/

COPY frontend/package.json frontend/yarn.lock /myapp/
RUN yarn install

COPY frontend /myapp
RUN yarn build

FROM nginx:1.19.0-alpine as e2e
RUN mkdir /myapp
COPY --from=e2e-build-stage /myapp/dist /myapp/public

RUN rm -f /etc/nginx/conf.d/*
COPY nginx/nginx.conf /etc/nginx/conf.d/myapp.conf
CMD /usr/sbin/nginx -g 'daemon off;' -c /etc/nginx/nginx.conf

# コマンド docker buildx build -t punct_web:e2e --target e2e -f nginx/Dockerfile .
