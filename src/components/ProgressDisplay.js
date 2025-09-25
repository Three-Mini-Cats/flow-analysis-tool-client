// src/components/ProgressDisplay.js
import React from 'react';

const ProgressDisplay = ({ percent }) => {
    const percentage = (percent * 100).toFixed(2);
    return (
        <div style={{ width: '60%', textAlign: 'center' }}>
            <h2>Transfer Progress</h2>
            <div style={{ border: '1px solid #ccc', borderRadius: '5px', height: '30px', backgroundColor: '#f0f0f0' }}>
                <div style={{
                    width: `${percentage}%`,
                    height: '100%',
                    backgroundColor: '#4caf50',
                    borderRadius: '5px',
                    transition: 'width 0.2s ease-in-out'
                }} />
            </div>
            <p style={{ fontSize: '1.5em', fontWeight: 'bold' }}>{percentage}%</p>
        </div>
    );
};

export default ProgressDisplay;