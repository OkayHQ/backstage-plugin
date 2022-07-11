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

import { createApiRef, DiscoveryApi } from '@backstage/core-plugin-api';
import { ApiBase } from './ApiBase';

export interface OkayBackendPluginApi {
  iframeUrl(uuid: string): Promise<{ url: string }>;
}

export const okayBackendPluginApiRef = createApiRef<OkayBackendPluginApi>({
  id: 'plugin.okay.backend'
});

export type OkayBackendPluginApiOptions = {
  discoveryApi: DiscoveryApi;
};

export class OkayBackendPluginApiClient extends ApiBase implements OkayBackendPluginApi {
  private readonly discoveryApi: DiscoveryApi;

  constructor(opts: OkayBackendPluginApiOptions) {
    super();
    this.discoveryApi = opts.discoveryApi;
  }

  protected async apiUrl(): Promise<string> {
    return this.discoveryApi.getBaseUrl('okay');
  }

  /**
   * @returns The url for the provided Okay dashboard UUID
   */
   async iframeUrl(uuid: string): Promise<{ url: string }> {
    return this.fetchJson<{ url: string }>(`/iframe_url/${uuid}`);
  }

}
