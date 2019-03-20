require 'spec_helper'
require 'configurations/session_time_configuration_provider'
require 'active_support/core_ext/integer/time'

describe SessionTimeConfigurationProvider do
  context 'SESSION_TIME is a number' do
    let(:provider) { SessionTimeConfigurationProvider.new('SESSION_TIME' => '5') }

    it 'returns number of minutes' do
      expect(provider.config).to eq(5.minutes)
    end
  end

  context 'SESSION_TIME is missing' do
    let(:provider) { SessionTimeConfigurationProvider.new({}) }

    it 'returns nil' do
      expect(provider.config).to be_nil
    end
  end

  context 'SESSION_TIME is text' do
    let(:provider) { SessionTimeConfigurationProvider.new('SESSION_TIME' => 'blah') }

    it 'returns nil' do
      expect(provider.config).to eq(nil)
    end
  end
end
