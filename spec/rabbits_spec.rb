require_relative 'spec_helper'

describe Rabbit do

	before(:each) do
		Rabbit.delete_all
	end

	it 'should allow a user to create a rabbit' do
		expect { Rabbit.create() }.to change {Rabbit.count}.by(1)
	end

	it 'should respond to the method #items' do
		expect(Rabbit.create()).to respond_to(:items)
	end
	
end