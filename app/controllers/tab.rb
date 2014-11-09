get '/' do #TODO remove '/'
	redirect '/tab/new'
end

get '/tab/new' do
	@tab = Tab.includes(:items).first
	@rabbits = [Rabbit.first]
	erb :'tab/new'
end