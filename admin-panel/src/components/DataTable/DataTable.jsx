import React from 'react';
import { Table } from 'antd';

const DataTable = ({ data, columns }) => {
    return <Table dataSource={data} columns={columns} />;
};

export default DataTable;
