get '/login' do
  @user = current_user
  erb :login
end

post '/login' do
	@user = User.find_by(email: params[:email])
  if @user.password == params[:password]
    session[:user_id] = @user.id
  else
    session[:errors] = @user.errors
    redirect '/login'
  end
end