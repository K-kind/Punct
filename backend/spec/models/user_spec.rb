require 'rails_helper'

RSpec.describe User, type: :model do
  let!(:saved_user) { create(:user) } # uniqueness検証のために必要
  let(:built_user) { build(:user) }

  it { should have_many(:tasks) }
  it { should have_many(:weekly_tasks).dependent(:destroy) }
  it { should have_many(:monthly_tasks).dependent(:destroy) }

  it { should validate_presence_of(:name) }
  it { should validate_length_of(:name).is_at_most(8) }

  it { should have_secure_password }
  it { should validate_presence_of(:password) }
  it { should validate_length_of(:password).is_at_least(6) }
  it { should validate_confirmation_of(:password) }
  it { should validate_presence_of(:password).on(:reset) }

  it { should validate_presence_of(:email) }
  it { should validate_length_of(:email).is_at_most(255) }
  it { should validate_uniqueness_of(:email).case_insensitive }
  it { should validate_confirmation_of(:email).on(:signup) }
  it { should validate_presence_of(:email_confirmation).on(:signup) }

  it 'should have valid email' do
    valid_addresses = %w[
      user@example.com
      USER@foo.COM
      A_US-ER@foo.bar.org
      first.last@foo.jp alice+bob@baz.cn
    ]

    valid_addresses.each do |valid_address|
      built_user.email = valid_address
      expect(built_user).to be_valid
    end
  end

  it 'should not have invalid email' do
    invalid_addresses = %w[
      user@example,com
      user_at_foo.org
      user.name@example.
      foo@bar_baz.com
      foo@bar+baz.com
      foo@bar..com
    ]

    invalid_addresses.each do |invalid_address|
      built_user.email = invalid_address
      expect(built_user).to be_invalid
    end
  end

  it 'has lower-case email' do
    uppper_case_email = 'TEST-USER@EXAMPLE.COM'
    built_user.email = uppper_case_email
    built_user.save
    expect(built_user.email).to eq uppper_case_email.downcase
  end

  context 'when logged in by oauth' do
    subject { User.new(uid: '111111', provider: 'google') }
    it { should validate_presence_of(:provider) }
    it { should validate_presence_of(:uid) }

    context 'with long name' do
      auth_data = {
        provider: 'google',
        uid: '222222',
        info: { name: ('a' * 9), email: 'test@gmail.com' }
      }
      user = User.find_or_create_from_auth(auth_data)

      it 'has trimmed name' do
        expect(user.name).to eq('a' * 8)
      end
    end
  end
end
