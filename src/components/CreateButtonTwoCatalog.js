import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import LocalActivityIcon from '@material-ui/icons/LocalActivity';
import StorefrontIcon from '@material-ui/icons/Storefront';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
}));

const CreateButtonTwoCatalog = ({ destination1, destination2 }) => {
  const classes = useStyles();
  return (
    <React.Fragment>
      <div className='create-button-two-catalog button-one'>
        <Link
          style={{
            textDecoration: 'none',
          }}
          to={destination1}
        >
          <Fab variant='extended'>
            <AddIcon />
            <LocalActivityIcon className={classes.extendedIcon} />
            Activity
          </Fab>
        </Link>
      </div>
      <div className='create-button-two-catalog button-two'>
        <Link
          style={{
            textDecoration: 'none',
          }}
          to={destination2}
        >
          <Fab variant='extended'>
            <AddIcon />
            <StorefrontIcon className={classes.extendedIcon} />
            Shop
          </Fab>
        </Link>
      </div>
    </React.Fragment>
  );
};

export default CreateButtonTwoCatalog;
