require 'rails_helper'

describe 'RetroSessionService' do
  subject { RetroSessionService.instance }

  before do
    subject.clear!
  end

  describe '#add_retro_consumer' do
    it 'is initially empty' do
      expect(subject.get_retro_consumers('retro_id')).to be_empty
    end

    it "adds the consumer's uuid to the retro" do
      subject.add_retro_consumer('retro_id', 'request_uuid_1')
      expect(subject.get_retro_consumers('retro_id')).to contain_exactly('request_uuid_1')

      subject.add_retro_consumer('retro_id', 'request_uuid_2')
      expect(subject.get_retro_consumers('retro_id')).to contain_exactly('request_uuid_1', 'request_uuid_2')
    end
  end

  describe '#remove_retro_consumer' do
    it "removes the consumer's uuid from the retro" do
      subject.add_retro_consumer('retro_id', 'request_uuid_1')
      subject.add_retro_consumer('retro_id', 'request_uuid_2')
      subject.remove_retro_consumer('retro_id', 'request_uuid_1')

      expect(subject.get_retro_consumers('retro_id')).to eq(['request_uuid_2'])
    end
  end
end
