#
# Postfacto, a free, open-source and self-hosted retro tool aimed at helping
# remote teams.
#
# Copyright (C) 2016 - Present Pivotal Software, Inc.
#
# This program is free software: you can redistribute it and/or modify
#
# it under the terms of the GNU Affero General Public License as
#
# published by the Free Software Foundation, either version 3 of the
#
# License, or (at your option) any later version.
#
#
#
# This program is distributed in the hope that it will be useful,
#
# but WITHOUT ANY WARRANTY; without even the implied warranty of
#
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#
# GNU Affero General Public License for more details.
#
#
#
# You should have received a copy of the GNU Affero General Public License
#
# along with this program.  If not, see <https://www.gnu.org/licenses/>.
#
# Add your own tasks in files placed in lib/tasks ending in .rake,
# for example lib/tasks/capistrano.rake, and they will automatically be available to Rake.

require_relative 'config/application'
Rails.application.load_tasks

if ENV['RAILS_ENV'] != 'production'
  require 'rubocop/rake_task'
  RuboCop::RakeTask.new
  task default: [:rubocop]
end

desc 'Starts the server'
task 'start' => :environment do
  system 'rails server -b 0.0.0.0 -p 4000'
end

desc 'Backfill slugs of records with id'
task 'backfill_slug' => :environment do
  Retro.where(slug: nil).each do |r|
    r.update_column(:slug, r.id)
  end
end
