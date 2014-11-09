require_relative 'spec_helper'

describe Tab do

	before(:each) do
		Tab.delete_all
	end

	it 'should allow a user to create a tab' do
		expect { Tab.create() }.to change {Tab.count}.by(1)
	end

	it 'should respond to the method #items' do
		expect(Tab.create()).to respond_to(:items)
	end
	
end