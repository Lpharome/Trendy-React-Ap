import React from 'react';
import { Card } from 'antd';
import './Widget.scss';

const Widget = ({ title, value, icon }) => {
    return (
        <Card className="widget">
            <div className="widget-content">
                <div className="widget-icon">{icon}</div>
                <div>
                    <h3>{title}</h3>
                    <p>{value}</p>
                </div>
            </div>
        </Card>
    );
};

export default Widget;
