module Filterable
  extend ActiveSupport::Concern

  OPERATORS = ['=', '<', '>', '<=', '>=', '!=', 'in', 'not in', 'ilike'].freeze

  class_methods do
    def accepts_filtering_scopes_for(*scopes)
      @filterable_scopes = scopes
    end

    def filterable_scopes
      @filterable_scopes || []
    end

    def apply_scopes(scopes)
      results = self.where(nil)

      scopes.each do |scope|
        raise ArgumentError, "Filtering by scope: #{scope[:name]} is not supported" unless is_valid_scope?(scope[:name])
        results = results.send(scope[:name], *(scope[:args] || []))
      end

      results
    end

    def is_valid_scope?(scope)
      scope.present? && filterable_scopes.include?(scope.to_sym)
    end
  end
end