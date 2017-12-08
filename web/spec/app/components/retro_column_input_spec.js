require('../spec_helper');

const RetroColumnInput = require('../../../app/components/retro_column_input');
const retroId = 'retro-slug-123';
const retro = {
  id: 123,
};

describe('inputting a retro item', () => {
  beforeEach(() => {
    ReactDOM.render(<RetroColumnInput retroId={retroId} retro={retro} category="happy" />, root);
  });
  it('adds an retro item when pressing enter', () => {
    expect($('textarea').attr('placeholder')).toEqual('I\'m glad that...');
    $('textarea').val('a new retro item').simulate('change');
    $('textarea').simulate('keyPress', {key: 'a'});
    expect('textarea').toHaveValue('a new retro item');
    $('textarea').simulate('keyPress', {key: 'Enter'});
    expect('createRetroItem').toHaveBeenDispatchedWith({
      type: 'createRetroItem',
      data: {retro_id: retroId, category: 'happy', description: 'a new retro item'}
    });
    expect('textarea').toHaveValue('');
  });

  it('adds an retro item when clicking button', () => {
    $('textarea').val('a new retro item').simulate('change');

    $('textarea').simulate('focus');
    $('.input-button').simulate('click');
    expect('createRetroItem').toHaveBeenDispatchedWith({
      type: 'createRetroItem',
      data: {retro_id: retroId, category: 'happy', description: 'a new retro item'}
    });
    expect('textarea').toHaveValue('');
  });

  it('doesn\'t add an item when pressing enter on an empty input field', () => {
    $('textarea').val('').simulate('change');
    $('textarea').simulate('keyPress', {key: 'Enter'});
    expect('createRetroItem').not.toHaveBeenDispatched();
  });
});

describe('inputting an action item', () => {
  let subject;
  beforeEach(() => {
    subject = ReactDOM.render(<RetroColumnInput retroId={retroId} retro={retro} category="action" />, root);
  });
  
  it('adds an action item when pressing enter', () => {
    expect($('textarea').attr('placeholder')).toEqual('Add an action item');
    $('textarea').val('a new action item').simulate('change');
    $('textarea').simulate('keyPress', {key: 'a'});
    expect('textarea').toHaveValue('a new action item');
    $('textarea').simulate('keyPress', {key: 'Enter'});
    expect('createRetroActionItem').toHaveBeenDispatchedWith({
      type: 'createRetroActionItem',
      data: {retro_id: retroId, description: 'a new action item'}
    });
    expect('textarea').toHaveValue('');
  });

  it('doesn\'t add an item when pressing enter on an empty input field', () => {
    $('textarea').val('').simulate('change');
    $('textarea').simulate('keyPress', {key: 'Enter'});
    expect('createRetroActionItem').not.toHaveBeenDispatched();
  });

  describe('when the textarea is resized', () => {
    it('adds moves the submit button to the next line', () => {
      $('textarea').val('a new action item').simulate('change');
      const mockEvent = {target: {value: 'a new action items'}};
      subject.onResize(mockEvent); //resize event could not be simulated, so working around this

      expect($('.input-box').attr('class')).toContain('multiline');
      expect($('.input-button-wrapper').attr('class')).toContain('multiline');
    });
  });
});