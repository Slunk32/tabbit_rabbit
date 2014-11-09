get '/' do #TODO remove '/'
	redirect '/tab/new'
end

get '/tab/new' do
	@tab = Tab.includes(:items).first
	erb :'tab/new'
end