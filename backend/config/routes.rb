Rails.application.routes.draw do
  scope '/api' do
    scope '/v1' do
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
      resources :products, only: [:index, :show, :create]
      resources :live_edge_slabs, controller: 'products', type: 'LiveEdgeSlab'
      resources :uploads, only: [:create, :destroy]
    end
  end
end
