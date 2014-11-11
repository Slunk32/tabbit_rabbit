require 'bcrypt'

class User < ActiveRecord::Base
  validates :email, uniqueness: true
  has_many :rabbits
  has_many :tabs
  include BCrypt

  def password
    @password ||= Password.new(password_hash)
  end

  def password=(new_password)
    @password = Password.create(new_password)
    self.password_hash = @password
  end

  after_create do
    rabbit = Rabbit.create(name: self.name, email: self.email, phone_number: self.phone_number)
    self.avatar_rabbit_id = rabbit.id
    self.rabbits << rabbit
    self.save
  end

end
