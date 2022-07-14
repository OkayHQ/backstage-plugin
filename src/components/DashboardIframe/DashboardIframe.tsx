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
import { Card, CardContent, Typography, Button } from '@material-ui/core';
import { configApiRef, useApi } from '@backstage/core-plugin-api';
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
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </CardContent>
    </Card>
  )
};

export const DashboardIframe = (props: {uuid: string}) => {
  // Add event listener to indicate that we're on the login page (no login cookies). Because we don't
  // want to actually support the login page in an iframe, which would be necessary as part of the login
  // redirect flow, instead we direct users to open a new tab and log into Okay. This will set their
  // browser cookies and authenticate them for the iframe request.
  const config = useApi(configApiRef);
  const domain = config.getOptionalString('okay.iframe.domain');

  const [login, setLogin] = React.useState({ 
    renderLogin: false,
    refreshPage: false
  })

  window.addEventListener('message', (event) => {
    if (event.origin === domain && event.type === 'message' && event.data === 'login_page') {
      setLogin({ renderLogin: true, refreshPage: false })
    } else {
      // postMessage sent from different origin than the iframe, do nothing
    }
  }, false);

  
  const okayApi = useApi(okayBackendPluginApiRef);
  const { value, loading, error } = useAsync(async () => await okayApi.iframeUrl(props.uuid));

  if (loading) {
    return <Progress />;
  } else if (error || !value) {
    return <Alert severity="error">{error ? error.message : 'Could not fetch iframe URL'}</Alert>;
  } else if (login.renderLogin) {
    return (
      <Card>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            Okay Dashboard
          </Typography>
          <Typography gutterBottom variant="body2" color="textSecondary">
            Log in to Okay to see your dashboard
          </Typography>
          <Button size="small" variant="contained" onClick={() => {
              setLogin({ renderLogin: false, refreshPage: true });
              window.open(`${domain}`, '_blank');
          }}>Take me to Okay</Button>
        </CardContent>
      </Card>
    )
  } else if (login.refreshPage) {
    return (
      <Card>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            Okay Dashboard
          </Typography>
          <Typography gutterBottom variant="body2" color="textSecondary">
            Please refresh the page to see your dashboard!
          </Typography>
        </CardContent>
      </Card>
    )
  }

  return <DashboardIframeCard dashboard={ { url: value.url }} />;
};
