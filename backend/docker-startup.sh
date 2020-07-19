#!/bin/sh

echo "creating db..."
bin/rails db:create
echo "migrating db..."
bin/rails db:migrate
echo "initializing crontab..."
service cron start
bundle exec whenever --update-crontab
echo "starting puma..."
bundle exec puma -C config/puma.rb
