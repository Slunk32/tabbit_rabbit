get '/' do #TODO remove '/'
	redirect '/tab/new'
end

get '/tab/new' do
	@tab = Tab.includes(:items).includes(:rabbits).first
	@rabbits = @tab.rabbits
	erb :'tab/new'
end


get '/tab/:id' do
	p params[:id]
	if request.xhr?
		tab = Tab.includes(:rabbits).includes(:items).find(params[:id])
		rabbits = tab.rabbits
		items = tab.items
		content_type :json
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