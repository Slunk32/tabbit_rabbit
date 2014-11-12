class Tab < ActiveRecord::Base
  belongs_to :user
  has_many :items
  has_and_belongs_to_many :rabbits
end
