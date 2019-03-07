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
require 'configurations/sendgrid_vcap_parser'

describe SendgridVCAPParser do
  it 'parses a CF-style VCAP_SERVICES string to generate a SendgridConfiguration' do
    vcap_services = {
      thewrongkey: [],
      sendgrid: [
        {
          credentials: {
            hostname: 'host',
            password: 'pass',
            username: 'user'
          }
        }
      ]
    }

    config = SendgridVCAPParser.get_configuration(vcap_services.to_json)
    expect(config.hostname).to eq('host')
    expect(config.username).to eq('user')
    expect(config.password).to eq('pass')
  end

  it 'fails if the services do not include sendgrid' do
    expect { SendgridVCAPParser.get_configuration('{"thewrongkey": []}') }.to raise_error(KeyError)
  end

  it 'fails if the services do not include sendgrid entries' do
    expect { SendgridVCAPParser.get_configuration('{"sendgrid": []}') }.to raise_error(NoMethodError)
  end

  it 'fails if the services do not include sendgrid credentials' do
    expect { SendgridVCAPParser.get_configuration('{"sendgrid": [{"nope": []}]}') }.to raise_error(KeyError)
  end

  it 'fails if the services do not include all sendgrid credentials' do
    vcap_services = {
      thewrongkey: [],
      sendgrid: [
        {
          credentials: {
            hostname: 'host',
            pass: 'wrong-key-name',
            username: 'user'
          }
        }
      ]
    }

    expect { SendgridVCAPParser.get_configuration(vcap_services.to_json) }.to raise_error(KeyError)
  end
end
