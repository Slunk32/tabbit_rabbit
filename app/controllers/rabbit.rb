post '/rabbit/new' do
	@rabbit = Rabbit.new(params)
	if @rabbit.save
		content_type :json
		@rabbit.to_json
	else
		status 500
	end
end