class UserController < ApplicationController
before_filter :authenticate_user!

  def new
    project = Project.create! params
    render :json => project
  end

  def index
    @user = User.where(:username => params[:username]).first()
    if @user
      @projects = @user.projects.all
    end

    case params[:format]
    when 'json'
      render :json => @projects
    else
      render 'index'
    end
  end
    
  def update
    project = Project.find(params[:project])
    project.update_attributes! params
    render :json => project
  end

end