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
require 'configurations/action_cable_configuration_provider'
require 'climate_control'

describe ActionCableConfigurationProvider do
  subject { ActionCableConfigurationProvider.new }

  describe '#config' do
    let(:client_origin) { 'fixture-client-origin' }

    around do |example|
      ClimateControl.modify('WEBSOCKET_PORT' => websocket_port, 'CLIENT_ORIGIN' => client_origin) do
        example.run
      end
    end

    context 'when WEBSOCKET_PORT is set in the environment' do
      let(:websocket_port) { 'fixture-port' }
      it 'uses that value in action cable url' do
        configuration = subject.config(host: 'fixture-host')

        expect(configuration.url).to eq('wss://fixture-host:fixture-port/cable')
        expect(configuration.allowed_request_origins).to eq(['https://fixture-host', 'fixture-client-origin'])
      end
    end

    context 'when WEBSOCKET_PORT is NOT set in the environment' do
      let(:websocket_port) { nil }

      it 'defaults to port 443' do
        configuration = subject.config(host: 'fixture-host')

        expect(configuration.url).to eq('wss://fixture-host:443/cable')
        expect(configuration.allowed_request_origins).to eq(['https://fixture-host', 'fixture-client-origin'])
      end
    end
  end

  context 'when CLIENT_ORIGIN is NOT set in the environment' do
    let(:client_origin) { nil }

    it 'does not include an empty allowed request origin' do
      configuration = subject.config(host: 'fixture-host')

      expect(configuration.allowed_request_origins).to eq(['https://fixture-host'])
    end
  end
end
