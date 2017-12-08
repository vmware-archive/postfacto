require 'rails_helper'

RSpec.describe ArchivedMailer, type: :mailer do
  describe 'archived_email' do
    let!(:user) do
      User.create!(email: 'me@example.com')
    end

    let!(:retro) do
      Retro.create!(name: 'My Retro', user: user)
    end

    let(:mail) do
      archive = retro.archives.create!(created_at: Time.new(2017, 1, 1))

      ActionItem.create!(retro: retro, description: 'An unresolved item', done: false, archive_id: archive.id)
      ActionItem.create!(retro: retro, description: 'A resolved item', done: true, archive_id: archive.id)
      ActionItem.create!(retro: retro, description: 'An old done item', done: true, archive_id: -1)

      ArchivedMailer.archived_email(retro, archive, user, 'postfacto@example.com')
    end

    it 'renders the headers' do
      expect(mail.subject).to eq('[Postfacto] My Retro retro action items from 1st January, 2017')
      expect(mail.to).to eq(['me@example.com'])
      expect(mail.from).to eq(['postfacto@example.com'])
      expect(mail.reply_to).to eq(['postfacto@example.com'])
      expect(mail.sender).to eq('postfacto@example.com')
    end

    it 'renders the body' do
      expect(mail.body.encoded).to include('My Retro')
      expect(mail.body.encoded).to include('A retro was archived on 1 January 2017')
      expect(mail.body.encoded).to include('An unresolved item')
      expect(mail.body.encoded).not_to include('A resolved item')
      expect(mail.body.encoded).not_to include('An old done item')
    end
  end
end
