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
source 'https://rubygems.org'

ruby '2.7.3'

gem 'rails', '>= 6.1.3.2'

gem 'activeadmin', '>= 2.7.0'
gem 'addressable'
gem 'bcrypt'
gem 'cf-app-utils'
gem 'devise', '>= 4.7.2'
gem 'friendly_id', '5.1.0'
gem 'inherited_resources', '>= 1.11.0'
gem 'jbuilder', '>= 2.10.0'
gem 'premailer-rails', '>= 1.11.1'
gem 'puma', '>= 5.3.1'
gem 'rack-cors', '>= 1.1.1', require: 'rack/cors'
gem 'rack-ssl', '>= 1.4.1'
gem 'rest-client'
gem 'sassc-rails', '~> 2.0.0'
gem 'uglifier'
gem 'jwt'

group :development, :test do
  gem 'dotenv-rails', '>= 2.7.5'
  gem 'pry'
  gem 'pry-byebug'
  gem 'rspec-rails', '>= 4.0.1'
  gem 'rubocop', require: false
  gem 'shoulda-matchers', '>= 4.0.1'
  gem 'webmock'
  gem 'tzinfo-data'
  gem 'climate_control'
  gem 'action-cable-testing', '>= 0.6.1'
end

group :development do
  gem 'sqlite3'
  gem 'bullet', '>= 6.1.0'
  gem 'listen'
  gem 'web-console', '>= 4.0.2'
end

group :production do
  gem 'redis', '~> 3.3.3'
  gem 'mysql2'
  gem 'pg'
end
