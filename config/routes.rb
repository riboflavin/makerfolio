Kitify::Application.routes.draw do
  devise_for :users

  root :to => "home#index"

  # json  
  get "/:username/json" => "user#index"
  get "/:username/:project/json" => "project#index"

  # projects
  get "/:username/new" => "project#create"
  get "/:username/:project/" => "project#index"
  put "/:username/:project/edit" => "project#update"
  delete "/:username/:project/delete" => "project#destroy"
  
  # attachments
  get "/:username/:project/attachments" => "attachment#index"
  get "/:username/:project/attachments/:id" => "attachment#index"
  post "/:username/:project/attachments/new" => "attachment#new"
  delete "/:username/:project/attachments/:id/delete" => "attachment#destroy"

  # users
  get "/:username" => "user#index"
  put "/:username/edit" => "user#update"

  # more or less static content
  get "/about" => "content#about"
  get "/contact" => "content#contact"
  get "/tandc" => "content#tandc"
    
end
