class UserController < ApplicationController
before_filter :authenticate_user!

  def new
    project = Project.create! params
    render :json => project
  end

  def index
    render :json => Project.find(params[:project])
  end
    
  def update
    project = Project.find(params[:project])
    project.update_attributes! params
    render :json => project
  end

end
