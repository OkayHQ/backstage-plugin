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

## Installing the dashboard list component
The dashboard list component shows a list of Okay dashboards in backstage. If you're interested in showing a group of dashboards, or tagging dashboards to show up in backstage, reach out to us!

1.  Install the Okay plugin in packages/app.
    ```
    $ yarn add --cwd packages/app @okayhq/backstage-plugin
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

## Installing the dashboard iframe component
The dashboard iframe component renders an iframe of an Okay dashboard.

1. Install the Okay plugin in packages/app.
    ```
    $ yarn add --cwd packages/app @okayhq/backstage-plugin
    ```
1. Go to your Okay account and [add a new "Iframe Allowed Domain"](https://app.okayhq.com/settings/edit/company). Input the domain of your backstage instance and save the **secret** and **id** that Okay returns to you.
    
2. Save the secret from the previous step as a backstage secret. Add the Okay iframe configuration `app-config.yaml`.
    ```
    # app-config.yaml
    okay:
      iframe:
        secret: ${OKAY_IFRAME_SECRET}
        id: <Your Okay iframe ID, like 5e4065a7-0d4a-414c-aad4-56d49035ce96>
    ```
  
3. Install the Okay Backend plugin in packages/backend. 
    ```
    $ yarn add --cwd packages/backend @okayhq/backstage-backend-plugin
    ```

4. Create a backend plugin file `packages/backend/src/plugins/okay.ts`
   ```
   import { createRouter } from '@okayhq/backstage-backend-plugin';
   import { Router } from 'express';
   import { PluginEnvironment } from '../types';

   export default async function createPlugin(
     env: PluginEnvironment,
   ): Promise<Router> {
     return await createRouter({
       logger: env.logger,
       config: env.config
     });
   }
   ```

5. Add the plugin to `packages/backend/src/index.ts`
    ```
    import okay from './plugins/okay';
    ...
    async function main() {
      ...
      const okayEnv = useHotMemoize(module, () => createEnv('okay'));
      apiRouter.use('/okay', await okay(okayEnv));
    ```

### Security overview
Each iframe element uses a unique URL with a nonce, timestamp, id, and hmac signature. We validate the nonce + timestamp for replay attack protection, validate the signature to ensure the request has not been changed, and finally check the referrer header against the company-configured allowlist. If the URL request is deemed valid, Okay sends back the Content Security header `Content-Security-Policy: frame-ancestors <Referrer>`, allowing the requester to iframe the app.

## Adding the Okay page
1. In App.tsx, import the `OkayPage` and add it to the routes list. The Okay page will be accessible at `/okay`.

    If you want to include a dashboard on the team page, add the dashboard uuid as a param. The dashboard uuid is the uuid in the URL. For example, for a dashboard URL like this:
    https://app.okayhq.com/dashboards/0baa30fe-f717-4ef5-8383-816b449bc5cc/my-team-dashboard the uuid is `0baa30fe-f717-4ef5-8383-816b449bc5cc`.
    ```
    # App.tsx
    import { OkayPage } from  '@okayhq/backstage-plugin';

    const routes = (
      <FlatRoutes>
        ...
        <Route path="/okay" element={<OkayPage uuid="your-dashboard-uuid-here" />} />
      </FlatRoutes>
    ```

2. In Root.tsx, add a SidebarItem component linking to the Okay page.
    ```
    # Root.tsx
    import Dashboard from '@material-ui/icons/Dashboard';
    ...
      
    export const Root = ({ children }: PropsWithChildren<{}>) => (  
      <SidebarPage>
        <Sidebar>
          <SidebarGroup label="Menu" icon={<MenuIcon />}>
            ...
            <SidebarItem icon={Dashboard} to="okay" text="Okay" />
          </SidebarGroup>
        </Sidebar>
      </SidebarPage>
    )
    ```

## Adding an Okay Dashboard Iframe Component to an entity page
Right now, you can add a hard-coded dashboard to an entity page. Coming soon, we will allow passing contextual information via annotations (e.g.: manager email, service name) to display templated dashboards.

```
# packages/app/src/components/catalog/EntityPage.tsx

...
import { OkayDashboardIframeComponent } from '@okayhq/backstage-plugin';


...
// Example: Adding a dashboard to the group page
const groupPage = (
  <EntityLayout>
    <EntityLayout.Route path="/" title="Overview">
      <Grid container spacing={3}>
        ...
        <Grid item md={12}>
          <OkayDashboardIframeComponent uuid="4811d86d-34ac-40da-996b-79d3fb6b3f70" />
        </Grid>
      </Grid>
    </EntityLayout.Route>
  </EntityLayout>
);
```