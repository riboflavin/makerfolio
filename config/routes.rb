Kitify::Application.routes.draw do
  devise_for :users

  root :to => "home#index"

  # users
  get "/:username/(:format)" => "user#index"
  put "/:username/" => "user#update"

  # projects
  get "/:username/new" => "project#create"
  get "/:username/:project/(:format) " => "project#index"
  put "/:username/:project/edit" => "project#update"
  delete "/:username/:project/delete" => "project#destroy"
    
  # attachments
  get "/:username/:project/attachments" => "attachment#index"
  get "/:username/:project/attachments/:id" => "attachment#index"
  post "/:username/:project/attachments" => "attachment#new"
  delete "/:username/:project/attachments/:id/delete" => "attachment#destroy"

  # more or less static content
  get "/about" => "content#about"
  get "/contact" => "content#contact"
  get "/tandc" => "content#tandc"
    
end
