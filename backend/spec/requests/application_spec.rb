require 'rails_helper'

RSpec.describe 'Application controller before_actions', type: :request do
  describe 'without xhr header' do
    it 'forbids requests' do
      post auth_path
      expect(response).to have_http_status(403)
    end
  end

  describe 'with xhr header' do
    it 'fowards requests' do
      headers = {
        'X-Requested-With': 'XMLHttpRequest'
      }
      post auth_path, headers: headers
      expect(response).to_not have_http_status(403)
    end
  end

  describe 'without login session' do
    it 'responds as unauthorized' do
      get tasks_path
      expect(response).to have_http_status(401)
    end
  end

  describe 'with login session' do
    it 'does not respond as unauthorized' do
      user = create(:user)
      allow_any_instance_of(ApplicationController).to receive(:current_user).and_return(user)
      get tasks_path
      expect(response).to_not have_http_status(401)
    end
  end
end
