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
#
require 'configurations/action_cable_host_provider'
require 'climate_control'

describe ActionCableHostProvider do
  subject { ActionCableHostProvider.new }

  describe '#host' do
    around do |example|
      ClimateControl.modify('ACTION_CABLE_HOST' => action_cable_host, 'VCAP_APPLICATION' => vcap_application) do
        example.run
      end
    end

    context 'when ACTION_CABLE_HOST is set in the environment' do
      let(:action_cable_host) { 'action-cable-host' }

      context 'when VCAP_APPLICATION is set in the environment' do
        let(:vcap_application) { { 'uris' => ['vcap-uri-a', 'vcap-uri-b'] }.to_json }

        it 'returns the ACTION_CABLE_HOST' do
          expect(subject.host).to eq('action-cable-host')
        end
      end

      context 'when VCAP_APPLICATION is NOT set in the environment' do
        let(:vcap_application) { nil }

        it 'returns the ACTION_CABLE_HOST' do
          expect(subject.host).to eq('action-cable-host')
        end
      end
    end

    context 'when ACTION_CABLE_HOST is NOT set in the environment' do
      let(:action_cable_host) { nil }

      context 'when VCAP_APPLICATION is set in the environment' do
        context 'and URIs do not contain a path' do
          let(:vcap_application) { { 'uris' => ['vcap-uri-a', 'vcap-uri-b'] }.to_json }

          it "returns the first hostname from VCAP_APPLICATION's uris" do
            expect(subject.host).to eq('vcap-uri-a')
          end
        end

        context 'and the URIs do contain a path' do
          let(:vcap_application) { { 'uris' => ['vcap-uri-a.example.com/some-cool-path'] }.to_json }

          it "returns the first hostname from VCAP_APPLICATION's uris with the path stripped out" do
            expect(subject.host).to eq('vcap-uri-a.example.com')
          end
        end
      end

      context 'when VCAP_APPLICATION is NOT set in the environment' do
        let(:vcap_application) { nil }

        it 'returns nil' do
          expect(subject.host).to be_nil
        end
      end
    end
  end
end
