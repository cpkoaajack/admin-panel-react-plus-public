import React from 'react';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import { Link } from 'react-router-dom';

const CreateButton = ({ destination }) => (
  <Link
    style={{
      textDecoration: 'none',
    }}
    to={destination}
  >
    <Fab color='primary' aria-label='add'>
      <AddIcon />
    </Fab>
  </Link>
);

export default CreateButton;
