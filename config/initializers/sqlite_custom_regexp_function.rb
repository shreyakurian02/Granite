# frozen_string_literal: true

ActiveRecord::ConnectionAdapters::AbstractAdapter.class_eval do
  alias_method :orig_initialize, :initialize

  def initialize(connection, logger = nil, pool = nil)
    orig_initialize(connection, logger, pool)

    if connection.is_a? SQLite3::Database
      connection.create_function("regexp", 2) do |fn, pattern, expr|
        regex_matcher = Regexp.new(pattern.to_s, Regexp::IGNORECASE)
        fn.result = expr.to_s.match(regex_matcher) ? 1 : 0
      end
    end
  end
end
