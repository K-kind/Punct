# syntax = docker/dockerfile:experimental

FROM ruby:2.7.1 AS base
RUN mkdir /myapp
WORKDIR /myapp
ENV TZ Asia/Tokyo
COPY Gemfile Gemfile.lock /myapp/

RUN bundle config path ".cache/bundle"

FROM base as develop
RUN --mount=type=cache,target=/myapp/.cache/bundle \
    bundle install && \
    mkdir -p vendor && \
    cp -ar .cache/bundle vendor/bundle
RUN bundle config path "vendor/bundle"

COPY . /myapp

CMD ["bundle", "exec", "puma", "-C", "config/puma.rb"]

FROM base as production
ARG KEY
ENV RAILS_MASTER_KEY $KEY
ENV RAILS_ENV production

RUN bundle config without "development test"
RUN bundle config path "vendor/bundle"
RUN bundle install

COPY . /myapp

# CMD ["./docker-startup.sh"]
