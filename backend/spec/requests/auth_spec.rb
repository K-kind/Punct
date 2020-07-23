require 'rails_helper'

RSpec.describe 'Auth', type: :request do
  let(:xhr_header) {
    {
      'X-Requested-With': 'XMLHttpRequest'
    }
  }
  let(:user) { create(:user) }

  before do
    allow_any_instance_of(ApplicationController).to receive(:current_user).and_return(user)
  end

  describe 'GET /name when logged in' do
    it 'returns user name' do
      get name_auth_path
      expect(response).to have_http_status(200)
      expect(json['name']).to eq user.name
    end
  end

  describe 'POST auth' do
    context 'with valid params' do
      it 'authenticates a user' do
        expect_any_instance_of(ApplicationController).to receive(:log_in).with(user)

        params = {
          email: user.email,
          password: user.password
        }
        post auth_path, params: params, headers: xhr_header

        expect(response).to have_http_status(200)
        expect(json['name']).to eq user.name
      end
    end

    context 'with invalid params' do
      it 'does not authenticate a user' do
        expect_any_instance_of(ApplicationController).to_not receive(:log_in).with(user)

        params = {
          email: 'invalid@example.com',
          password: 'invalid password'
        }
        post auth_path, params: params, headers: xhr_header

        expect(response).to have_http_status(200)
        expect(json['errors']).to_not be_nil
      end
    end
  end

  describe 'DELETE auth' do
    it 'deletes a login session' do
      expect_any_instance_of(ApplicationController).to receive(:log_out)

      delete auth_path, headers: xhr_header

      expect(response).to have_http_status(200)
      expect(json['message']).to_not be_nil
    end
  end
end
