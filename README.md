# Okay Backstage Plugin

Welcome to the [Okay](https://www.okayhq.com/) plugin!

This plugin connects Backstage with your Okay account to visualize your team analytics. Embed dashboards (including DORA metrics) alongside your team or service pages. 
Create dashboards from any of your dev tools (including Github, Gitlab, Jira, CircleCI, Argo, Buildkite, Pagerduty, Rollbar, Sentry and dozens of others). 
Additionally send your own metrics with the Okay custom events endpoint. 

![okay_app](./docs/okay_app.png?raw=true)

The Okay plugin allows you to display a the list of company saved dashboards to surface important goals and metrics.

![dashboard_list](./docs/dashboard_list.png?raw=true)

Coming soon is the ability to render any saved dashboard or chart directly in Backstage.

![dashboard_list](./docs/dashboard_iframe.png?raw=true)


To get started with Okay & Backstage, check out our [product tour](https://www.okayhq.com/tour) and get in contact with us for more information!

## Installing the plugin

1.  Install the Okay plugin in packages/app.
```
$ cd packages/app && yarn add @okayhq/backstage-plugin
```
2.  Go to your Okay account and [create an API token](https://app.okayhq.com/settings/edit/company).
3. Add Okay to the [proxy config](https://backstage.io/docs/plugins/proxying) in  `app-config.yaml` and save the token from the previous step as a secret.
```
# app-config.yaml
proxy:
  '/okay/api':
    target: https://app.okayhq.com
    headers:
      Authorization: Bearer ${OKAY_TOKEN}
```

## Adding the Okay page
In the main App.tsx file, import the `OkayPage` and add it to the routes list. The Okay page will be accessible at `/okay`.
```
# App.tsx
import { OkayPage } from  '@okayhq/backstage-plugin';

const routes = (
  <FlatRoutes>
	  ...
	  <Route path="/okay" element={<OkayPage  />} />
  </FlatRoutes>
```