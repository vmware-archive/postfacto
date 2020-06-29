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
import '../../spec_helper';
import {mount} from 'enzyme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import ArchiveRetroDialog from './archive_retro_dialog';

function createRetro(isPrivate = false) {
  return {
    id: 13,
    name: 'the retro name',
    is_private: isPrivate,
    video_link: 'http://the/video/link',
    send_archive_email: false,
    items: [
      {
        id: 1,
        description: 'the happy retro item',
        category: 'happy',
      },
      {
        id: 2,
        description: 'the meh retro item',
        category: 'meh',
      },
      {
        id: 3,
        description: 'the sad retro item',
        category: 'sad',
      },
    ],
    action_items: [],
  };
}

function mountArchiveRetroDialog(props) {
  return mount((
    <MuiThemeProvider>
      <ArchiveRetroDialog
        title="foo"
        message="Testing"
        retro={createRetro()}
        onClose={jest.fn()}
        featureFlags={{archiveEmails: true}}
        toggleSendArchiveEmail={jest.fn()}
        archiveRetro={jest.fn()}
        {...props}
      />
    </MuiThemeProvider>
  ));
}

function getDialogElement() {
  // Dialog renders outside usual flow, so must use hacks:
  return document.getElementsByClassName('archive-dialog')[0];
}

describe('ArchiveRetroDialog', () => {
  it('does not show the email toggle when the feature flag is off', () => {
    mountArchiveRetroDialog({
      featureFlags: {
        archiveEmails: false,
      },
    });
    const popupDialog = getDialogElement();
    expect(popupDialog.querySelector('#send_archive_email')).toBeFalsy();
  });

  it('invokes archiveRetro and onClose when the confirmation button is clicked', () => {
    const archiveRetro = jest.fn();
    const onClose = jest.fn();
    const retro = createRetro();
    mountArchiveRetroDialog({
      retro,
      archiveRetro,
      onClose,
    });

    const popupDialog = getDialogElement();
    popupDialog.querySelector('.archive-dialog__actions--archive').click();

    expect(onClose).toHaveBeenCalled();
    expect(archiveRetro).toHaveBeenCalledWith(retro);
  });

  it('invokes onClose when the cancel button is clicked', () => {
    const onClose = jest.fn();
    mountArchiveRetroDialog({
      onClose,
    });

    const popupDialog = getDialogElement();
    popupDialog.querySelector('.archive-dialog__actions--cancel').click();
    expect(onClose).toHaveBeenCalled();
  });

  it('invokes toggleSendArchiveEmail when the email preference is toggled', () => {
    const toggleSendArchiveEmail = jest.fn();
    const retro = createRetro();
    retro.send_archive_email = false;

    mountArchiveRetroDialog({
      retro,
      toggleSendArchiveEmail,
    });

    const popupDialog = getDialogElement();
    expect(popupDialog.querySelector('.archive-dialog__actions--archive').textContent).toBe('Archive');
    popupDialog.querySelector('#send_archive_email').click();
    expect(toggleSendArchiveEmail).toHaveBeenCalledWith(true);
  });

  it('changes the text of the confirmation button when the email preference is toggled', () => {
    const retro = createRetro();
    retro.send_archive_email = true;

    mountArchiveRetroDialog({
      retro,
    });

    const popupDialog = getDialogElement();
    expect(popupDialog.querySelector('.archive-dialog__actions--archive').textContent).toBe('Archive & send email');
  });

  it('displays title and message given in dialog', () => {
    mountArchiveRetroDialog({
      title: 'Some dialog title',
      message: 'Some dialog message',
    });

    const popupDialog = getDialogElement();
    expect(popupDialog.querySelector('h3').innerHTML).toEqual('Some dialog title');
    expect(popupDialog.querySelector('p').innerHTML).toEqual('Some dialog message');
  });
});
