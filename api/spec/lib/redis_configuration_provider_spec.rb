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
require 'configurations/redis_configuration_provider'
require 'climate_control'

describe RedisConfigurationProvider do
  let(:subject) { RedisConfigurationProvider.new }

  describe '#redis_config' do
    around do |example|
      ClimateControl.modify('RAILS_ENV' => rails_env, 'VCAP_SERVICES' => vcap_services, 'REDIS_URL' => redis_url) do
        example.run
      end
    end

    context 'when running outside of production' do
      let(:rails_env) { 'development' }
      let(:vcap_services) { 'unused-vcap-services-value' }
      let(:redis_url) { 'unused-redis-url=-value' }

      it 'is nil ' do
        expect(subject.redis_config).to be_nil
      end
    end

    context 'when running in production' do
      let(:rails_env) { 'production' }

      context 'when REDIS_URL is defined in the environment' do
        let(:redis_url) { 'redis://user:pass@hostname.com:420' }

        context 'when VCAP_SERVICES is defined in the environment' do
          let(:vcap_services) do
            {
              'redis' => [
                {
                  'tags' => 'redis',
                  'credentials' => {
                    'hostname' => 'hostname',
                    'password' => 'irrelevant',
                    'port' => 234
                  }
                }
              ]
            }.to_json
          end

          it 'returns the url from REDIS_URL' do
            expect(subject.redis_config).to eq('redis://user:pass@hostname.com:420')
          end
        end

        context 'when VCAP_SERVICES is NOT defined in the environment' do
          let(:vcap_services) { nil }
          it 'returns the url from REDIS_URL' do
            expect(subject.redis_config).to eq('redis://user:pass@hostname.com:420')
          end
        end
      end

      context 'when REDIS_URL is not defined in the environment' do
        let(:redis_url) { nil }

        context 'when VCAP_SERVICES is defined in the environment' do
          context 'and host is declared as hostname' do
            let(:vcap_services) do
              {
                'redis' => [
                  {
                    'tags' => 'redis',
                    'credentials' => {
                      'hostname' => 'hostname',
                      'password' => 'pass',
                      'port' => 234
                    }
                  }
                ]
              }.to_json
            end

            it 'builds a URL based upon the redis service described by vcap services' do
              expect(subject.redis_config).to eq('redis://:pass@hostname:234')
            end
          end

          context 'and host is declared as host' do
            let(:vcap_services) do
              {
                'redis' => [
                  {
                    'tags' => 'redis',
                    'credentials' => {
                      'host' => 'host',
                      'password' => 'pass',
                      'port' => 234
                    }
                  }
                ]
              }.to_json
            end

            it 'builds a URL based upon the redis service described by vcap services' do
              expect(subject.redis_config).to eq('redis://:pass@host:234')
            end
          end

          context 'and the password contains special characters' do
            let(:vcap_services) do
              {
                'redis' => [
                  {
                    'tags' => 'redis',
                    'credentials' => {
                      'hostname' => 'hostname',
                      'password' => 'pass/wo=d',
                      'port' => 234
                    }
                  }
                ]
              }.to_json
            end

            it 'builds a URL based upon the redis service described by vcap services' do
              expect(subject.redis_config).to eq('redis://:pass%2Fwo%3Dd@hostname:234')
            end
          end
        end

        context 'when VCAP_SERVICES is NOT defined in the environment' do
          let(:vcap_services) { nil }

          it 'returns nil' do
            expect(subject.redis_config).to be_nil
          end
        end
      end
    end
  end
end
