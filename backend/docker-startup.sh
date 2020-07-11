#!/bin/sh

echo "creating db..."
bin/rails db:create
echo "migrating db..."
bin/rails db:migrate
echo "starting puma..."
bundle exec puma -C config/puma.rb
