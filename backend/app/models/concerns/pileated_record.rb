module PileatedRecord
  extend ActiveSupport::Concern

  included do
    include Filterable
  end
end