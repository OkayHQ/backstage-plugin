# Okay Backstage Plugin

Welcome to the [Okay](https://www.okayhq.com/) plugin!

This plugin connects Backstage with your Okay account to connect your Okay team analytics to Backstage.



Currently, this plugin displays the list of company saved dashboards. Coming soon is the ability to render
any saved dashboard or chart directly in Backstage.

## Installing the plugin

1.  Install the Okay plugin in packages/app.
```
$ cd packages/app && yarn add @okay/backstage-plugin-okay
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
import { OkayPage } from  '@backstage/plugin-okay';

...

const  routes = (
<FlatRoutes>
	...
	<Route path="/okay" element={<OkayPage  />} />
</FlatRoutes>
```