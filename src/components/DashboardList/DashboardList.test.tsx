/*
 * Copyright 2022 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import React from 'react';
import { render } from '@testing-library/react';
import { setupServer } from 'msw/node';
import { setupRequestMockHandlers, TestApiRegistry } from '@backstage/test-utils';
import { ApiProvider } from '@backstage/core-app-api';
import { DashboardList } from './DashboardList';
import { okayApiRef } from '../../api';

describe('DashboardComponent', () => {
  const server = setupServer();
  // Enable sane handlers for network requests
  setupRequestMockHandlers(server);

  const dashboardName1 = 'Incidents Dashboard'
  const dashboardName2 = 'OKRs Q1 2022'
  const apis = TestApiRegistry.from(
    [
      okayApiRef,
      {
        dashboards: () => Promise.resolve({dashboards: [
          {
            type: 'custom' as const,
            url: 'https://www.okayhq.com/fake/url/aaa',
            uuid: 'aaa',
            name: dashboardName1,
            userLastUpdatedAt: '2022-06-14T22:25:16Z',
            isDraft: false,
            isReadOnly: false,
            creatorKnownPeopleDisplayName: 'Firstname Lastname',
            creatorKnownPeopleSlackProfileImage: 'image1'
          },{
            type: 'custom' as const,
            url: 'https://www.okayhq.com/fake/url/bbb',
            uuid: 'bbb',
            name:dashboardName2,
            userLastUpdatedAt: '2022-06-10T10:20:10Z',
            isDraft: false,
            isReadOnly: false,
            creatorKnownPeopleDisplayName: 'Otherfirstname Otherlastname',
            creatorKnownPeopleSlackProfileImage: 'image2'
          }
        ]})
      }
    ],
  );
  
  it('should render list of dashboards', async () => {
    const rendered = render(
      <ApiProvider apis={apis}>
        <DashboardList />
      </ApiProvider>,
    );
    expect(await rendered.findByText('Dashboards')).toBeInTheDocument();
    expect(await rendered.findByText(dashboardName1)).toBeInTheDocument();
    expect(await rendered.findByText(dashboardName2)).toBeInTheDocument();
  });
});
