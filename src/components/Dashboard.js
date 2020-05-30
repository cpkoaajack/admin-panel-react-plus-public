import React, { useState, useEffect } from 'react';
import { BASE_URL } from '../constants.js';
import DashboardItem from './DashboardItem';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

const Dashboard = () => {
  const collections = [
    'users',
    'shops',
    'activities',
    'tags',
    'news',
    'shopTypes',
    'reports',
  ];

  const [quantityData, setQuantityData] = useState({
    users: 0,
    activities: 0,
    shops: 0,
    shopTypes: 0,
    tags: 0,
    news: 0,
    reports: 0,
  });

  const style = {
    dashBoardSection: { padding: '1rem 2rem', margin: '5rem 0' },
  };

  useEffect(() => {
    collections.map((collection) => fetchQuantityFromDB(collection));
  }, []);

  const fetchQuantityFromDB = async (collection) => {
    setQuantityData((quantityData) => ({
      ...quantityData,
      [collection]: 'Refreshing...',
    }));

    try {
      let response = await fetch(`${BASE_URL}/admin/${collection}/quantity`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      response = await response.json();

      if (response.success) {
        if (collection === 'users') {
          setQuantityData((quantityData) => ({
            ...quantityData,
            [collection]: response.data.length,
          }));
        } else {
          setQuantityData((quantityData) => ({
            ...quantityData,
            [collection]: response.data,
          }));
        }
      }
    } catch (error) {
      console.log(error);

      setQuantityData((quantityData) => ({
        ...quantityData,
        [collection]: 'No response from server',
      }));
    }
  };

  const handleRefresh = (toBeRefresh) => {
    fetchQuantityFromDB(toBeRefresh);
  };

  const dashboardElementQuantity = collections.map((collection) => (
    <DashboardItem
      key={collection}
      item={{ name: collection, data: quantityData[collection] }}
      dataRefreshHandler={handleRefresh}
    />
  ));

  return (
    <div className='local-container'>
      <Paper elevation={3} style={style.dashBoardSection}>
        <div className='dashboard-header'>
          <Typography variant='h4' component='h4'>
            Records
          </Typography>
        </div>
        <div className='dashboard-upper'>{dashboardElementQuantity}</div>
      </Paper>

      {/* <Paper elevation={3} style={style.dashBoardSection}>
        <div className='dashboard-header'>
          <Typography variant='h4' component='h4'>
            Trends
          </Typography>
        </div>
        <div className='dashboard-lower'>
          <h1>Coming Soon...</h1>
        </div>
      </Paper> */}
    </div>
  );
};

export default Dashboard;
