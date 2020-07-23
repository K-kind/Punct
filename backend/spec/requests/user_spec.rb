require 'rails_helper'

RSpec.describe 'User', type: :request do
  let(:xhr_header) {
    {
      'X-Requested-With': 'XMLHttpRequest'
    }
  }
  let(:user) { create(:user) }

  before do
    allow_any_instance_of(ApplicationController).to receive(:current_user).and_return(user)
  end

  describe 'POST user' do
    context 'with valid params' do
      it 'creates a user' do
        expect_any_instance_of(ApplicationController).to receive(:log_in)

        params = {
          user: {
            name: '新しいユーザー',
            email: 'new_user@example.com',
            email_confirmation: 'new_user@example.com',
            password: 'password',
            password_confirmation: 'password'
          }
        }

        expect {
          post user_path, params: params, headers: xhr_header
        }.to change(User, :count).by(1)

        expect(response).to have_http_status(200)
        expect(json['name']).to eq '新しいユーザー'
      end
    end

    context 'with invalid params' do
      it 'does not create a user' do
        expect_any_instance_of(ApplicationController).to_not receive(:log_in)

        params = {
          user: {
            name: '',
            email: 'invalid',
            email_confirmation: 'wrong confirmation',
            password: 'short',
            password_confirmation: 'wrong confirmation'
          }
        }

        expect {
          post user_path, params: params, headers: xhr_header
        }.to change(User, :count).by(0)

        expect(response).to have_http_status(200)
        expect(json['errors'].length).to_not be_zero
      end
    end
  end

  describe 'GET user' do
    it 'returns user info' do
      get user_path, headers: xhr_header

      expect(response).to have_http_status(200)
      expect(json['user']).to be_truthy
    end
  end

  describe 'PATCH user' do
    context 'with valid params' do
      it 'updates a user' do
        params = {
          user: {
            name: '変更したユーザー',
            email: 'updated_user@example.com',
            password: 'updated_password',
            password_confirmation: 'updated_password'
          }
        }

        patch user_path, params: params, headers: xhr_header

        expect(user.reload.name).to eq '変更したユーザー'
        expect(response).to have_http_status(200)
        expect(json['user']).to be_truthy
      end
    end

    context 'with invalid params' do
      it 'does not update a user' do
        params = {
          user: {
            name: '長すぎるユーザー名',
            email: 'invalid',
            password: 'short',
            password_confirmation: 'wrong confirmation'
          }
        }

        patch user_path, params: params, headers: xhr_header

        expect(user.reload.name).to_not eq '長すぎるユーザー名'
        expect(response).to have_http_status(200)
        expect(json['errors'].length).to_not be_zero
      end
    end
  end

  describe 'DELETE user' do
    it 'destroys a user' do
      expect_any_instance_of(ApplicationController).to receive(:log_out)

      expect {
        delete user_path, headers: xhr_header
      }.to change(User, :count).by(-1)

      expect(response).to have_http_status(200)
      expect(json['message']).to_not be_nil
    end
  end
end
