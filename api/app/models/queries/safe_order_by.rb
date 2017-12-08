class SafeOrderBy
  def initialize(relation, mapping)
    @relation = relation
    @mapping = mapping
  end

  def ordering(order)
    order ||= ''
    descending = order.end_with? '_desc'
    logical = order.sub(/_[^_]*$/, '')
    if @mapping[logical]
      return @mapping[logical] + (descending ? ' DESC' : ' ASC')
    end
    ''
  end

  def order(order)
    @relation.order(ordering(order))
  end
end
