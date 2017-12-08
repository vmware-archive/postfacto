ActiveAdmin.register Item, as: 'Retro Items' do
  menu priority: 2
  actions :index

  index do
    column('ID', :id)
    column('Description', :description)
    column('Category', :category)
    column('Reaction Count', :vote_count)
    column('Done', :done)
    column('Created At', :created_at)
    column('Updated At', :updated_at)
    column('Archived At', :archived_at)
  end
end
