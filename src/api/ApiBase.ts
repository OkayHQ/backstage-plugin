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
export abstract class ApiBase {
  protected abstract apiUrl(): Promise<string>;

  private async _fetch(path: string): Promise<Response> {
    const apiUrl = await this.apiUrl();
    const resp = await fetch(`${apiUrl}${path}`);
    if (!resp.ok) {
      throw new Error(`Fetch request failed status=${resp.status} statusText=${resp.statusText}`);
    }
    return resp;
  }

  protected async fetchJson<T = any>(path: string): Promise<T> {
    return (await this._fetch(path)).json();
  }

}
