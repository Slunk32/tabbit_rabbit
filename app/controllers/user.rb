after do
  ActiveRecord::Base.clear_active_connections!
end

get '/login' do
  redirect '/' if authenticated?
  # Render errors if there are any
  @errors = session[:errors]
  @email = session[:email]
  session[:errors], session[:email] = nil
  erb :login
end

post '/login' do
  session[:email] = params[:email]
  @user = User.find_by(email: params[:email])
  if @user.nil?
    session[:errors] = {email: "No account with that username"}
    redirect '/login'
  elsif @user.password == params[:password]
    session[:email] = nil
    session[:user_id] = @user.id
    redirect '/'
  else
    session[:errors] = {password: "Incorrect Password"}
    redirect '/login'
  end
end

get '/users/new' do
  redirect '/' if authenticated?
  # Prepare to render errors if there are any
  @user = session[:user]
  @errors = session[:errors]
  session[:errors] = nil

  erb :signup
end

post '/users/new' do
  user_params = Hash[params[:user].map { |k,v| [k.to_sym, v] } ]
  session[:user] = user_params
  @user = User.new(params[:user])
  @user.password = params[:password]
  if @user.save
    session[:user] = nil
    session[:user_id] = @user.id
    redirect '/'
  else
    session[:errors] = @user.errors
    redirect '/users/new'
  end
end

get '/signout' do
  session[:user_id] = nil
  redirect '/login'
end

