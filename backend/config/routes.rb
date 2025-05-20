Rails.application.routes.draw do
  scope '/api' do
    scope '/v1' do
      devise_scope :user do
        get '/users/me', to: 'users/sessions#me'
      end

      devise_for :users,
                 path: '',
                 path_names: {
                   sign_in: 'users/login',
                   sign_out: 'users/logout',
                   registration: 'users/signup'
                 },
                 controllers: {
                   sessions: 'users/sessions',
                   registrations: 'users/registrations'
                 },
                 defaults: { format: :json }
    end
  end

  namespace :api do
    namespace :v1 do
      resources :carts, only: [:show, :update]
      resources :cart_items, only: [:create, :update, :destroy]
      resources :guest_carts, only: [:show, :create] do
        member do
          post 'add_to_cart', to: 'guest_carts#add_item'
          post 'remove_from_cart', to: 'guest_carts#remove_item'
          post 'update_quantity', to: 'guest_carts#update_quantity'
        end
      end
      resources :live_edge_slabs, controller: 'products', type: 'LiveEdgeSlab'
      resources :orders, only: [:index, :show, :create]
      resources :products, only: [:index, :show, :create, :update, :destroy]
      resources :uploads, only: [:create, :destroy]

      post 'webhooks/stripe', to: 'webhooks#stripe'
    end
  end
end
