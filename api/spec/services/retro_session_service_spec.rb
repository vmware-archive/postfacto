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
require_relative '../../../api/app/services/retro_session_service'

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
