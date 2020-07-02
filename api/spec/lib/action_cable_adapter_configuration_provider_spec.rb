require 'configurations/action_cable_adapter_configuration_provider'
require 'climate_control'

describe ActionCableAdapterConfigurationProvider do
  let(:fake_redis_url) { 'fake-redis-url' }

  subject { ActionCableAdapterConfigurationProvider.new }

  around do |example|
    ClimateControl.modify('REDIS_URL' => fake_redis_url, 'RAILS_ENV' => 'production') do
      example.run
    end
  end

  describe 'when USE_POSTGRES_FOR_ACTION_CABLE is not set' do
    it 'returns the redis configuration' do
      config = subject.cable_config
      expect(JSON.parse(config)['adapter']).to eq('redis')
      expect(JSON.parse(config)['url']).to eq(fake_redis_url)
    end
  end

  describe 'when USE_POSTGRES_FOR_ACTION_CABLE is set' do
    around do |example|
      ClimateControl.modify('USE_POSTGRES_FOR_ACTION_CABLE' => use_postgres_for_action_cable_env) do
        example.run
      end
    end

    context 'to true' do
      let(:use_postgres_for_action_cable_env) { 'true' }
      it 'returns the adapter as postgresql with no url' do
        config = subject.cable_config
        expect(JSON.parse(config)['adapter']).to eq('postgresql')
        expect(JSON.parse(config)['url']).to be_nil
      end
    end

    context 'to false' do
      let(:use_postgres_for_action_cable_env) { 'false' }

      it 'returns the redis configuration' do
        config = subject.cable_config
        expect(JSON.parse(config)['adapter']).to eq('redis')
        expect(JSON.parse(config)['url']).to eq(fake_redis_url)
      end
    end
  end
end
