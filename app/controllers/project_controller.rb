class ProjectController < ApplicationController
before_filter :authenticate_user!

  def index
    render :json => Project.all(:user => :username)
  end
  
  def show
    render :json => current_user.Project.find(params[:id])
  end
  
  def create
    render :json => Project.new(:user => current_user)
  end
  
  def update
    document = current_user.Project.find(params[:id])
    document.update_attributes! params
    render :json => document
  end
end