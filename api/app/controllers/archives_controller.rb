class ArchivesController < ApplicationController
  before_action :load_retro, :authenticate_retro_admin

  def index
    @archives = @retro.archives
  end

  def show
    @archive = @retro.archives.find params.fetch(:id)
  end
end
