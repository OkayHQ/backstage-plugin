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
import { format, parseISO } from 'date-fns';
import React from 'react';
import useAsync from 'react-use/lib/useAsync';
import { useApi } from '@backstage/core-plugin-api';
import { Table, TableColumn, Progress } from '@backstage/core-components';
import Alert from '@material-ui/lab/Alert';
import { Link, Avatar } from '@material-ui/core';

import { Dashboard } from '../../types';
import { okayApiRef } from '../../api';

export const DenseTable = ({ dashboards }: { dashboards: Dashboard[] }) => {
  const columns: TableColumn<Dashboard>[] = [
    {
      title: 'Name',
      field: 'name',
      render: (data: Dashboard): React.ReactNode => (
        <Link href={data.url} target="_blank" rel="noopener">
          {data.name}
        </Link>
      )
    },
    {
      title: 'Owner',
      render: (data: Dashboard): React.ReactNode => {
        if (data.creatorKnownPeopleDisplayName) {
          const parts = data.creatorKnownPeopleDisplayName.split(' ').filter((p) => p.length > 0);
          const initials =
            parts.length === 2
              ? `${parts[0][0].toUpperCase()} ${parts[1][0].toUpperCase()}`
              : `${parts[0][0].toUpperCase}`;
          return <Avatar>{initials}</Avatar>;
        }
        return <span>Okay Preset</span>;
      }
    },
    {
      title: 'Last Modified',
      render: (data: Dashboard): React.ReactNode => {
        return <span>{format(parseISO(data.userLastUpdatedAt), 'MMM dd, h:mm a')}</span>;
      }
    }
  ];

  return (
    <Table
      title="Dashboards"
      options={{ search: false, paging: false, sorting: false }}
      columns={columns}
      data={dashboards}
      onRowClick={(_event: React.MouseEvent | undefined, rowData: Dashboard | undefined) =>
        rowData ? window.open(rowData.url, '_blank') : ''
      }
    />
  );
};

export const DashboardList = () => {
  const okayApi = useApi(okayApiRef);
  const { value, loading, error } = useAsync(async () => await okayApi.dashboards());

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }

  return (
    <DenseTable dashboards={value ? value.dashboards.map((d) => ({ ...d, id: d.uuid })) : []} />
  );
};
