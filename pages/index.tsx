import React from 'react';
import SunburstChart from '../components/SunburstChart';
import data from '../data/data.json';

const Home: React.FC = () => {
  return (
    <div style={{ width: '100%', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#f6f6f6' }}>
      <SunburstChart data={data} />
    </div>
  );
};

export default Home;
