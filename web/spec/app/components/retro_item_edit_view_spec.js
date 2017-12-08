require('../spec_helper');

const RetroItemEditView = require('../../../app/components/retro_item_edit_view');

describe('RetroItemEditView', () => {
  let deleteSpy, saveSpy;

  beforeEach(() => {
    deleteSpy = jasmine.createSpy('delete');
    saveSpy = jasmine.createSpy('save');
    ReactDOM.render(
      <RetroItemEditView
        originalText="item text"
        deleteItem={deleteSpy}
        saveItem={saveSpy}
      />, root
    );
  });

  it('should display edit view', () => {
    expect('textarea').toHaveValue('item text');
    expect('.edit-delete').toExist();
    expect('.edit-save').toExist();
  });

  describe('when typing in the text field ', () => {
    const sharedUpdateActionBehavior = () => {
      it('updates the action item', () => {
        expect(saveSpy).toHaveBeenCalledWith('some other value');
      });
    };

    describe('when save button is clicked', () => {
      beforeEach(() => {
        $('textarea').val('some other value').simulate('change');
        $('.edit-save').simulate('click');
      });

      sharedUpdateActionBehavior();
    });

    describe('when enter key is pressed', () => {
      beforeEach(() => {
        $('textarea').val('some other value').simulate('change');
        $('textarea').simulate('keyPress', {key: 'Enter'});
      });

      sharedUpdateActionBehavior();
    });

    it('does not allow editing if value is empty', () => {
      $('textarea').val('').simulate('change');
      $('.edit-save').simulate('click');
      expect(saveSpy).not.toHaveBeenCalled();
    });
  });

  describe('when clicking on delete ', () => {
    it('should remove the action item', () => {
      $('.edit-delete').simulate('click');
      expect(deleteSpy).toHaveBeenCalled();
    });
  });
});