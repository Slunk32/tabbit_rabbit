get '/' do
	if authenticated?
		@user = current_user
		@tabs = Tab.find_by(user_id: @user.id)
	else
		@tabs = nil
	end

	erb :home
end

before '/tabs/*' do
	redirect '/login' unless authenticated?
end

get '/tabs/new' do
	erb :'tab/create'
end

get '/tabs/new' do
	erb :'tab/create'
end


get '/tab/:tab_id' do
	if request.xhr?
		content_type :json
		tab = Tab.includes(:rabbits).includes(:items).find(params[:tab_id])
		rabbits = tab.rabbits
		items = tab.items
		{tab: tab, rabbits: rabbits, items: items}.to_json
	else
		@user = current_user
		@tab = Tab.includes(:items).includes(:rabbits).find(params[:tab_id])
		@rabbits = @user.rabbits
		erb :'tab/tab'
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
