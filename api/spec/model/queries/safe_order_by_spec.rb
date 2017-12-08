require 'rails_helper'

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
