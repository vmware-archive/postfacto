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

require 'rails_helper'

RSpec.describe RetrosChannel, type: :channel do
  describe 'subscription' do
    context 'for private retro' do
      let!(:retro) do
        Retro.create!(name: 'My Retro', password: 'the-password', is_private: true)
      end

      context 'with correct API token provided' do
        before do
          subscribe(retro_id: retro.id, api_token: token_for(retro))
        end

        it 'is confirmed' do
          expect(subscription).to be_confirmed
        end
      end

      it 'does not broadcast the encrypted password or salt' do
        expect {
          RetrosChannel.broadcast(retro)
        }.to have_broadcasted_to(retro).with { |payload|
          expect(payload['retro']).not_to include 'encrypted_password'
          expect(payload['retro']).not_to include 'salt'
        }
      end
    end
  end
end
