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
# require 'rails_helper'

require 'queries/safe_order_by'

describe SafeOrderBy do
  it 'translates given ActiveAdmin order strings into order-by clauses' do
    ordering = SafeOrderBy.new(nil, 'foo' => 'bar').ordering('foo_asc')
    expect(ordering).to eq('bar ASC')
  end

  it 'recognises descending flags' do
    ordering = SafeOrderBy.new(nil, 'foo' => 'bar').ordering('foo_desc')
    expect(ordering).to eq('bar DESC')
  end

  it 'ignores unknown values' do
    ordering = SafeOrderBy.new(nil, 'foo' => 'bar').ordering('nope_desc')
    expect(ordering).to eq('')
  end

  it 'does not explode when given nil values' do
    ordering = SafeOrderBy.new(nil, 'foo' => 'bar').ordering(nil)
    expect(ordering).to eq('')
  end
end
