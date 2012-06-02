Kitify::Application.routes.draw do
  devise_for :users
  resource :user

  root :to => "home#index"

  # projects
  post "/:username/new" => "project#new"
  get "/:username/:project/" => "project#index"
  put "/:username/:project/edit" => "project#update"
  delete "/:username/:project/delete" => "project#destroy"
    
  # attachments
  post "/:username/:project/attachments" => "attachment#new"
  get "/:username/:project/attachments" => "attachment#index"
  delete "/:username/:project/attachments/:id/delete" => "attachment#destroy"

  # more or less static content
  get "/about" => "content#about"
  get "/contact" => "content#contact"
  get "/tandc" => "content#tandc"
  get "/consulting" => "content#consulting"
  get "/browse" => "kit#browse"
    
end
