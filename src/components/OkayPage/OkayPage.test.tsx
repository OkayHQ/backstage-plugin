/*
 * Copyright 2022 Okay, Inc.
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
import { ThemeProvider } from '@material-ui/core';
import { lightTheme } from '@backstage/theme';
import { setupServer } from 'msw/node';
import { setupRequestMockHandlers, renderInTestApp, TestApiRegistry } from '@backstage/test-utils';
import { ApiProvider } from '@backstage/core-app-api';
import { okayProxyApiRef } from '../../api';
import { OkayPage } from './OkayPage';

describe('OkayPage', () => {
  const server = setupServer();
  // Enable sane handlers for network requests
  setupRequestMockHandlers(server);

  const apis = TestApiRegistry.from([
    okayProxyApiRef,
    { dashboards: () => Promise.resolve({ dashboards: [] }) }
  ]);

  it('should render', async () => {
    const rendered = await renderInTestApp(
      <ApiProvider apis={apis}>
        <ThemeProvider theme={lightTheme}>
          <OkayPage uuid="" />
        </ThemeProvider>
      </ApiProvider>
    );
    expect(
      rendered.getByText('Flexible analytics and reporting for software teams')
    ).toBeInTheDocument();
  });
});
