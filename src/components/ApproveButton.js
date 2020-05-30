import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import PanToolIcon from '@material-ui/icons/PanTool';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
}));

const ApproveButton = ({ destination }) => {
  const classes = useStyles();

  return (
    <Link
      style={{
        textDecoration: 'none',
      }}
      to={destination}
    >
      <Fab variant='extended'>
        <PanToolIcon className={classes.extendedIcon} />
        Approve
      </Fab>
    </Link>
  );
};

export default ApproveButton;
