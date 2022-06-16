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

import { createApiRef, DiscoveryApi } from '@backstage/core-plugin-api';
import { Dashboard } from '../types';

export interface OkayApi {
  dashboards(): Promise<{ dashboards: Dashboard[] }>;
}

export const okayApiRef = createApiRef<OkayApi>({
  id: 'plugin.okay.service'
});

export type Options = {
  discoveryApi: DiscoveryApi;
  proxyPath?: string;
};

const DEFAULT_BASE_PATH = '/okay/api';

export class OkayApiClient implements OkayApi {
  private readonly discoveryApi: DiscoveryApi;
  private readonly proxyPath: string;

  constructor(opts: Options) {
    this.discoveryApi = opts.discoveryApi;
    this.proxyPath = opts.proxyPath ? opts.proxyPath : DEFAULT_BASE_PATH;
  }

  private async fetch<T = any>(input: string): Promise<T> {
    const apiUrl = await this.apiUrl();
    const resp = await fetch(`${apiUrl}${input}`);
    if (!resp.ok) {
      throw new Error(`Fetch request failed status=${resp.status} statusText=${resp.statusText}`);
    }

    return await resp.json();
  }

  /**
   * @returns A list of all public dashboards for the company. Drafted (private) dashboards are
   *          not returned.
   */
  async dashboards(): Promise<{ dashboards: Dashboard[] }> {
    return this.fetch<{ dashboards: Dashboard[] }>(`/api/external/dashboards`);
  }

  private async apiUrl() {
    const proxyUrl = await this.discoveryApi.getBaseUrl('proxy');
    return proxyUrl + this.proxyPath;
  }
}
