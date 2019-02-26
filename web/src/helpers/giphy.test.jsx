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
import Giphy from './giphy';

import '../spec_helper';

describe('Giphy', () => {
  let subject = null;
  let fetchSpy = null;

  beforeEach(() => {
    subject = new Giphy('xyz-123');
    fetchSpy = jest.spyOn(window, 'fetch');
  });

  it('isSupported should return false when not supported', async () => {
    fetchSpy.mockRejectedValue(new Error('some error'));

    expect(await subject.isSupported()).toEqual(false);
  });

  it('isSupported should return true when supported', async () => {
    fetchSpy.mockResolvedValue({status: 200, json: () => ''});

    expect(await subject.isSupported()).toEqual(true);
  });

  it('with no matches returns the original string', async () => {
    expect(await subject.interpolate('xyz')).toEqual('xyz');
  });

  it('return an array with img elements replacing matches', async () => {
    fetchSpy.mockResolvedValue({
      status: 200,
      json: () => ({url: 'http://example.com/gif'}),
    });

    const result = await subject.interpolate('abc /giphy def /giphy ghi jkl');

    expect(result).toEqual([
      'abc ',
      <img key="def" src="http://example.com/gif" alt="def"/>,
      ' ',
      <img key="ghi" src="http://example.com/gif" alt="ghi"/>,
      ' jkl',
    ]);
  });

  it('returns the original match for any failed match replacements', async () => {
    fetchSpy
      .mockResolvedValueOnce({status: 200, json: () => ''})
      .mockResolvedValueOnce({
        status: 200,
        json: () => ({url: 'http://example.com/gif'}),
      })
      .mockRejectedValueOnce(new Error('example'));

    const result = await subject.interpolate('abc /giphy def /giphy ghi jkl');

    expect(result).toEqual([
      'abc ',
      <img key="def" src="http://example.com/gif" alt="def"/>,
      ' ',
      '/giphy ghi',
      ' jkl',
    ]);
  });
});
