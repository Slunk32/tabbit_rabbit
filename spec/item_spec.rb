require_relative 'spec_helper'

describe Item do

	before(:each) do
		Item.delete_all
	end

	it 'should allow a user to create a Item' do
		expect { Item.create() }.to change {Item.count}.by(1)
	end

	it 'should respond to the method #tab' do
		expect(Item.create()).to respond_to(:tab)
	end

	it 'should respond to the method #rabbits' do
		expect(Item.create()).to respond_to(:rabbits)
	end

end