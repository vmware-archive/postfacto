/*
 * Postfacto, a free, open-source and self-hosted retro tool aimed at helping
 * remote teams.
 *
 * Copyright (C) 2016 - Present Pivotal Software, Inc.
 *
 * This program is free software: you can redistribute it and/or modify
 *
 * it under the terms of the GNU Affero General Public License as
 *
 * published by the Free Software Foundation, either version 3 of the
 *
 * License, or (at your option) any later version.
 *
 *
 *
 * This program is distributed in the hope that it will be useful,
 *
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 *
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *
 * GNU Affero General Public License for more details.
 *
 *
 *
 * You should have received a copy of the GNU Affero General Public License
 *
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import React from 'react';
import {mount} from 'enzyme';
import Scroll from 'react-scroll';
import '../../spec_helper';

import RetroColumnItem from './retro_column_item';

describe('RetroColumnItem', () => {
  let voteRetroItem;
  let doneRetroItem;
  let undoneRetroItem;
  let highlightRetroItem;
  let unhighlightRetroItem;
  let updateRetroItem;
  let deleteRetroItem;
  let scrollTo;

  const WiredRetroColumnItem = (props) => {
    voteRetroItem = jest.fn();
    doneRetroItem = jest.fn();
    undoneRetroItem = jest.fn();
    highlightRetroItem = jest.fn();
    unhighlightRetroItem = jest.fn();
    updateRetroItem = jest.fn();
    deleteRetroItem = jest.fn();
    scrollTo = jest.fn();
    return (
      <RetroColumnItem
        voteRetroItem={voteRetroItem}
        doneRetroItem={doneRetroItem}
        undoneRetroItem={undoneRetroItem}
        highlightRetroItem={highlightRetroItem}
        unhighlightRetroItem={unhighlightRetroItem}
        updateRetroItem={updateRetroItem}
        deleteRetroItem={deleteRetroItem}
        scrollTo={scrollTo}
        {...props}
      />
    );
  };

  const retroId = 'retro-slug-123';
  const item = {
    id: 2,
    description: 'the happy retro item',
    vote_count: 1,
    category: 'happy',
    done: false,
  };
  const item_done = {
    id: 20,
    description: 'the discussed retro item',
    vote_count: 10,
    category: 'happy',
    done: true,
  };

  describe('on desktop', () => {
    let dom;

    beforeEach(() => {
      dom = mount(<WiredRetroColumnItem
        retroId={retroId}
        item={item}
        highlighted_item_id={null}
        archives={false}
        isMobile={false}
      />);
    });

    it('shows vote count and message', () => {
      expect(dom.find('.vote-count')).toIncludeText('1');
      expect(dom.find('.item-text')).toHaveText('the happy retro item');
    });

    describe('editing', () => {
      beforeEach(() => {
        dom.find('.item-edit i').simulate('click');
      });

      it('displays an edit menu', () => {
        expect(dom.find('.retro-item')).toHaveClassName('editing');
      });

      it('dispatches a delete action when delete button clicked', () => {
        dom.find('.edit-delete i').simulate('click');

        expect(deleteRetroItem).toHaveBeenCalledWith(retroId, item);
      });

      it('does not highlight the item when clicking on the item description', () => {
        dom.find('.edit-text').simulate('click');

        expect(highlightRetroItem).not.toHaveBeenCalled();
      });

      describe('setting a non-empty value', () => {
        beforeEach(() => {
          dom.find('.edit-text textarea').simulate('change', {target: {value: 'an updated retro item'}});
        });

        it('updates the retro item when save button is clicked', () => {
          dom.find('.edit-save').simulate('click');

          expect(dom.find('.retro-item')).not.toHaveClassName('editing');
          expect(updateRetroItem).toHaveBeenCalledWith(retroId, item, 'an updated retro item');
        });

        it('updates the retro item when enter key is pressed', () => {
          dom.find('.edit-text textarea').simulate('keyPress', {key: 'Enter'});

          expect(dom.find('.retro-item')).not.toHaveClassName('editing');
          expect(updateRetroItem).toHaveBeenCalledWith(retroId, item, 'an updated retro item');
        });
      });

      describe('setting an empty value', () => {
        beforeEach(() => {
          dom.find('.edit-text textarea').simulate('change', {target: {value: ''}});
        });

        it('disables the Save button', () => {
          expect(dom.find('.edit-save')).toHaveClassName('disabled');
        });

        it('does not allow item to be updated', () => {
          dom.find('.edit-save').simulate('click');

          expect(updateRetroItem).not.toHaveBeenCalled();
        });
      });
    });

    it('dispatches a vote action when voted on', () => {
      dom.find('.item-vote-submit').simulate('click');

      expect(voteRetroItem).toHaveBeenCalledWith(retroId, item);
    });

    it('highlights the item when text is clicked', () => {
      dom.find('.item-text button').simulate('click');

      expect(highlightRetroItem).toHaveBeenCalledWith(retroId, item);
    });

    describe('another item is highlighted', () => {
      beforeEach(() => {
        dom = mount(<WiredRetroColumnItem retroId={retroId} item={item} highlighted_item_id={5} archives={false} isMobile={false}/>);
      });

      it('contains additional class lowlight', () => {
        expect(dom.find('.retro-item')).toHaveClassName('lowlight');
      });

      it('hides edit button', () => {
        expect(dom.find('.item-edit i')).not.toExist();
      });
    });

    it('scrolls to the centre of the screen when highlighted', () => {
      jest.spyOn(Scroll.scroller, 'scrollTo').mockReturnValue(null);

      expect(dom.find('.retro-item')).not.toHaveClassName('highlight');

      dom.setProps({highlighted_item_id: 2});

      expect(dom.find('.retro-item')).toHaveClassName('highlight');
      expect(scrollTo).toHaveBeenCalledWith('retro-item-2', expect.objectContaining({
        delay: 0,
        duration: 300,
      }));
    });

    describe('highlighted items', () => {
      beforeEach(() => {
        dom = mount(<WiredRetroColumnItem
          retroId={retroId}
          item={item}
          highlighted_item_id={2}
          archives={false}
          isMobile={false}
        />);
      });

      it('is marked as highlight', () => {
        expect(dom.find('.retro-item')).toHaveClassName('highlight');
      });

      it('does not scroll when highlighted again', () => {
        jest.spyOn(Scroll.scroller, 'scrollTo').mockReturnValue(null);

        dom.setProps({highlighted_item_id: 2});
        expect(Scroll.scroller.scrollTo).not.toHaveBeenCalled();
      });

      it('unhighlights when text is clicked', () => {
        dom.find('.item-text button').simulate('click');

        expect(unhighlightRetroItem).toHaveBeenCalledWith(retroId);
      });

      it('sets to discussed when done is clicked', () => {
        dom.find('.item-done').simulate('click');

        expect(doneRetroItem).toHaveBeenCalledWith(retroId, item);
      });

      it('unhighlights when cancel is clicked', () => {
        dom.find('.retro-item-cancel').simulate('click');

        expect(unhighlightRetroItem).toHaveBeenCalledWith(retroId);
      });
    });

    describe('done items', () => {
      beforeEach(() => {
        dom = mount(<WiredRetroColumnItem retroId={retroId} item={item_done} highlighted_item_id={null} archives={false} isMobile={false}/>);
      });

      it('is marked discussed', () => {
        expect(dom.find('.retro-item')).toHaveClassName('discussed');
      });

      it('hides the edit button', () => {
        expect(dom.find('.item-edit')).not.toExist();
      });

      it('dispatches undoneRetroItem when cancel is clicked', () => {
        dom = mount(<WiredRetroColumnItem retroId={retroId} item={item_done} highlighted_item_id={20} archives={false} isMobile={false}/>);

        dom.find('.retro-item-cancel').simulate('click');

        expect(undoneRetroItem).toHaveBeenCalledWith(retroId, item_done);
      });
    });
  });

  describe('archive mode', () => {
    let dom;

    beforeEach(() => {
      dom = mount(<RetroColumnItem
        retroId={retroId}
        item={item}
        highlighted_item_id={null}
        archives
        isMobile={false}
      />);
    });

    it('does not highlight clicked items', () => {
      dom.find('.item-text button').simulate('click');
      expect(highlightRetroItem).not.toHaveBeenCalled();
    });

    it('does not record votes', () => {
      dom.find('.item-vote-submit').simulate('click');
      expect(voteRetroItem).not.toHaveBeenCalled();
    });

    it('does not allow deletion', () => {
      expect(dom.find('.item-delete')).not.toExist();
    });
  });

  describe('on mobile', () => {
    it('does not highlight clicked items', () => {
      const dom = mount(<WiredRetroColumnItem retroId={retroId} item={item} highlighted_item_id={null} archives={false} isMobile/>);
      dom.find('.item-text button').simulate('click');
      expect(highlightRetroItem).not.toHaveBeenCalled();
    });

    it('does not mark items as done', () => {
      const dom = mount(<WiredRetroColumnItem retroId={retroId} item={item} highlighted_item_id={2} archives={false} isMobile/>);
      dom.find('.item-done').simulate('click');
      expect(doneRetroItem).not.toHaveBeenCalled();
    });
  });
});
