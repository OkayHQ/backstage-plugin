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
import { Card, CardContent } from '@material-ui/core';
import { useApi } from '@backstage/core-plugin-api';
// eslint-disable-next-line
import { useAsync } from 'react-use';
import { Progress } from '@backstage/core-components';
import Alert from '@material-ui/lab/Alert';
import { okayBackendPluginApiRef } from '../../api/OkayBackendPluginApi';

const DashboardIframeCard = ({ dashboard }: { dashboard: {url: string} }) => {
  return (
    <Card>
      <CardContent>
        <iframe
          title="okay-dashboard-iframe"
          src={dashboard.url}
          width="100%"
          height={800}
          frameBorder="0"
        />
      </CardContent>
    </Card>
  );
};

export const DashboardIframe = (props: {uuid: string}) => {
  const okayApi = useApi(okayBackendPluginApiRef);
const { value, loading, error } = useAsync(async () => await okayApi.iframeUrl(props.uuid));

  if (loading) {
    return <Progress />;
  } else if (error || !value) {
    return <Alert severity="error">{error ? error.message : 'Could not fetch iframe URL'}</Alert>;
  }

  return (
        <DashboardIframeCard dashboard={ {url: value.url }} />
      );
};
