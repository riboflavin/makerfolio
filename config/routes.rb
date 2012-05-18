Kitify::Application.routes.draw do
  root :to => "home#index"
    
  # attachments
  post "/:username/:slug/:token/attachments" => "attachment#new"
  get "/:username/:slug(/:token)/attachments" => "attachment#index"
  delete "/:username/:slug/:token/attachments/:id" => "attachment#destroy"

  # customizations
  post "/:username/:slug/:token/customizations" => "customization#new"
  get "/:username/:slug(/:token)/customizations" => "customization#index"
  
  # get/create items
  get "/:username/:slug/items" => "item#index"
  post "/:username/:slug/items/:id" => "item#update"
  post "/:username/:slug/items" => "item#create"
  delete "/:username/:slug/items/:id" => "item#destroy"
  
  # get/create steps
  get "/:username/:slug/steps" => "step#index"
  post "/:username/:slug/steps" => "step#create"
  post "/:username/:slug/steps/:id" => "step#update"
  post "/:username/:slug/:token/steps/reorder" => "step#reorder"
  delete "/:username/:slug/steps/:id" => "step#destroy"

  # more or less static content
  get "/about" => "content#about"
  get "/contact" => "content#contact"
  get "/tandc" => "content#tandc"
  get "/consulting" => "content#consulting"
  get "/browse" => "kit#browse"
  
  # kit creation
  get "/new" => "kit#create"
  post "/new" => "kit#create"
  
  # get/update kit
  get "/getkits" => "kit#getkits"
  get "/:username/:slug(/:token)" => "kit#index"
  post "/:username/:slug/:token" => "kit#update"
  delete "/:username/:slug/:token" => "kit#destroy"
  
#add default route
end
