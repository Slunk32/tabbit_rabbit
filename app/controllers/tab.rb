get '/' do
	#TODO remove this (for dev purposes only)
	# session[:user_id] = User.first.id
	if current_user
		@user = current_user
		@tabs = @user.tabs
		p @user
		p @tabs
	else
		@tabs = nil
	end

	erb :home
end

before '/tab/*' do
	redirect '/login' unless authenticated?
end

get '/tab/new' do
	@user = current_user
	p @user.tabs
	#TODO remove .first!
	@tab = @user.tabs.includes(:items).includes(:rabbits).first
	@rabbits = @user.rabbits
	erb :'tab/new'
end


get '/tab/:id' do
	if request.xhr?
		content_type :json
		tab = Tab.includes(:rabbits).includes(:items).find(params[:id])
		rabbits = tab.rabbits
		items = tab.items
		{tab: tab, rabbits: rabbits, items: items}.to_json
	end
end

post '/tab/:id/rename' do
	p params
	@tab = Tab.find(params[:id])
	content_type :json
	if @tab.update_attributes(name: params[:value])
		{id: @tab.id}.to_json
	else
		{errors: @tab.errors}.to_json
	end
end
