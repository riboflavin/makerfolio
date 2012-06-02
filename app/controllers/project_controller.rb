class DocumentsController < ApplicationController
  def index
    render :json => Project.all
  end
  
  def show
    render :json => Project.find(params[:id])
  end
  
  def create
    document = Project.create! params
    render :json => document
  end
  
  def update
    document = Project.find(params[:id])
    document.update_attributes! params
    render :json => document
  end
end