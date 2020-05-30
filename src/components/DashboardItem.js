import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import AutorenewRoundedIcon from '@material-ui/icons/AutorenewRounded';

const useStyles = makeStyles({
  root: {
    borderRadius: '15px',
  },
  title: {
    fontSize: '1.2rem',
  },
  pos: {
    marginBottom: 12,
  },
});

const styleObj = {
  users: {
    icon: 'fas fa-users',
    style: { backgroundColor: '#FF6347' },
  },
  activities: {
    icon: 'fas fa-map-marked-alt',
    style: { backgroundColor: '#FFFACD' },
  },
  shops: {
    icon: 'fas fa-store',
    style: { backgroundColor: '#FF8C00' },
  },
  shopTypes: {
    icon: 'fas fa-shopping-bag',
    style: { backgroundColor: '#87CEFA' },
  },
  tags: {
    icon: 'fas fa-tags',
    style: { backgroundColor: '#00FF7F' },
  },
  news: {
    icon: 'far fa-calendar-check',
    style: { backgroundColor: '#ADFF2F' },
  },
  reports: {
    icon: 'fas fa-bug',
    style: { backgroundColor: '#9370DB' },
  },
};

const DashboardItem = ({ item, dataRefreshHandler }) => {
  const classes = useStyles();
  const { name, data } = item;

  const style = {
    font: { paddingLeft: '1rem' },
    icon: { paddingTop: '5px', paddingRight: '10px' },
    button: { marginLeft: '1rem' },
  };

  return (
    <Card className={classes.root} style={styleObj[name].style}>
      <CardContent>
        <Typography
          className={`${classes.title} ${classes.pos}`}
          gutterBottom
          style={style.font}
        >
          {name.toUpperCase()}
        </Typography>
        <div className='dashboard-item-data'>
          <Typography variant='h4' component='h4' style={style.font}>
            {data}
          </Typography>
          <i className={`${styleObj[name].icon} fa-2x`} style={style.icon}></i>
        </div>
      </CardContent>
      <CardActions>
        <Button
          size='small'
          style={style.button}
          onClick={() => dataRefreshHandler(name)}
        >
          <AutorenewRoundedIcon />
          Refresh
        </Button>
      </CardActions>
    </Card>
  );
};

export default DashboardItem;
