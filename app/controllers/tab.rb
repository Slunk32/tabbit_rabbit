get '/' do #TODO remove '/'
	redirect '/tab/new'
end

get '/tab/new' do
	@tab = Tab.includes(:items).first
	@rabbits = Rabbit.all
	erb :'tab/new'
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