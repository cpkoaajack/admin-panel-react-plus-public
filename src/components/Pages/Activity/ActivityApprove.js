import React, { useState, useEffect } from 'react';
import { Typography, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import ActivityItem from './ActivityItem';
import { BASE_URL } from '../../../constants';
import Loading from '../../Loading';
import ErrorMessage from '../../ErrorMessage';

const useStyles = makeStyles({
  root: {
    marginTop: '5rem',
    maxWidth: 300,
  },
});

const ActivityApprove = () => {
  const classes = useStyles();
  const [isFetch, setIsFetch] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const [activity, setActivity] = useState({});
  const [message, setMessage] = useState('');
  const loading = <Loading />;

  const handleApprove = async () => {
    try {
      let response = await fetch(`${BASE_URL}/admin/activities/admin/approve`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: activity['_id'],
          status: 'valid',
        }),
      });

      response = await response.json();

      if (response.success && response.data) {
        setIsSubmit(true);
      } else {
        setMessage('Activity Approval Failed');
      }
    } catch (error) {
      console.log(error);

      setMessage('No response from server');
    }
  };

  const handleDisapprove = async () => {
    try {
      let response = await fetch(`${BASE_URL}/admin/activities/admin/approve`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: activity['_id'],
          status: 'invalid',
        }),
      });

      response = await response.json();

      if (response.success && response.data) {
        setIsSubmit(true);
      } else {
        setMessage('Activity Disapprove Failed');
      }
    } catch (error) {
      console.log(error);

      setMessage('No response from server');
    }
  };

  const fetchPendingActivity = async () => {
    let response;
    try {
      response = await fetch(`${BASE_URL}/admin/activities/admin/approve`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      response = await response.json();

      if (response.success && response.data) {
        setActivity(response.data);
        setIsFetch(true);
      } else {
        setMessage('There are no activity waiting for approval');
      }
    } catch (error) {
      console.error(error);

      setMessage('No response from server');
    }
  };

  useEffect(() => {
    fetchPendingActivity();
  }, []);

  useEffect(() => {
    setIsFetch(false);
    setIsSubmit(false);
    setActivity({});
    fetchPendingActivity();
  }, [isSubmit]);

  if (message) {
    return (
      <ErrorMessage
        open={true}
        message={message}
        handleClose={() => setMessage('')}
      />
    );
  }

  if (!isFetch) return <div className='loader-list'>{loading}</div>;

  return (
    <div className='local-container'>
      <div className='approve-item'>
        <div className='pending-item'>
          <ActivityItem activity={activity} />
        </div>
        <div className='approve-area'>
          <Card className={classes.root} style={{ padding: '0px 20px' }}>
            <CardContent>
              <Typography
                gutterBottom
                variant='h5'
                component='h2'
                style={{ textAlign: 'center' }}
              >
                Please select to
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                variant='outlined'
                color='primary'
                onClick={() => handleApprove()}
              >
                Approve
              </Button>
              <Typography
                gutterBottom
                variant='h5'
                component='h2'
                style={{ padding: '0px 6px' }}
              >
                or
              </Typography>
              <Button
                variant='outlined'
                color='secondary'
                onClick={() => handleDisapprove()}
              >
                Disapprove
              </Button>
            </CardActions>
            <CardContent>
              <Typography
                gutterBottom
                variant='h5'
                component='h2'
                style={{ textAlign: 'center' }}
              >
                this activity
              </Typography>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ActivityApprove;
