get '/' do #TODO remove '/'
	redirect '/tab/new'
end

get '/tab/new' do
	@tab = Tab.includes(:items).first
	@rabbits = Rabbit.all
	erb :'tab/new'
end