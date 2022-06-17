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
import { Grid } from '@material-ui/core';
import { Header, Page, Content, ContentHeader } from '@backstage/core-components';
import { DashboardList } from '../DashboardList';
import { DashboardIFrame } from '../DashboardIFrame';

export const OkayPage = () => (
  <Page themeId="tool">
    <Header title="Okay" subtitle="Flexible analytics and reporting for software teams" />
    <Content>
      <ContentHeader title="Okay" />
      <Grid container spacing={3} direction="column">
        <Grid item>
          <DashboardIFrame />
        </Grid>
        <Grid item>
          <DashboardList />
        </Grid>
      </Grid>
    </Content>
  </Page>
);
