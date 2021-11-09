class ApplicationController < ActionController::Base
  layout -> { false if modal? }
  before_action { request.variant = :modal if modal? }

  private

  def modal?
    request.headers['X-Show-In-Modal'].present?
  end
end
