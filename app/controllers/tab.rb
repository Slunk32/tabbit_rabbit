get '/' do #TODO remove '/'
	redirect '/tab/new'
end

get '/tab/new' do
	erb :'tab/new'
end