#!/bin/sh

echo "waiting for db..."
dockerize -wait tcp://db:3306 -timeout 120s
echo "creating db..."
bin/rails db:create
echo "migrating db..."
bin/rails db:migrate
echo "creating seed data..."
bin/rails db:seed
echo "starting puma..."
bundle exec puma -C config/puma.rb
