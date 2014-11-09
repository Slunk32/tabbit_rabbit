class Tab < ActiveRecord::Base
  has_many :items
  has_many :rabbits
end
