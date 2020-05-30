import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Divider from '@material-ui/core/Divider';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';

import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';

import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 900,
  },
  folder: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: theme.palette.background.paper,
  },
}));

const stringToHslColor = (str, s = 50, l = 70) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let hue = hash % 360;
  return { backgroundColor: `hsl(${hue}, ${s}%, ${l}%)` };
};

const ShopTypeItem = ({ shopType }) => {
  const { _id, status, text_en, text_zh } = shopType;

  const classes = useStyles();

  let statusListItem;
  switch (status) {
    case 'enabled':
      statusListItem = (
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <CheckIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary='Status' secondary={status} />
        </ListItem>
      );
      break;
    case 'disabled':
      statusListItem = (
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <CloseIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary='Status' secondary={status} />
        </ListItem>
      );
      break;
    default:
      statusListItem = (
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <CloseIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary='Status' secondary='You will not get here' />
        </ListItem>
      );
  }

  return (
    <Card className={classes.root}>
      <CardHeader
        avatar={
          <Avatar aria-label='recipe' style={stringToHslColor(text_en)}>
            {text_en.charAt(0)}
          </Avatar>
        }
        action={
          <Link to={`/dashboard/shopTypes/${_id}`}>
            <IconButton aria-label='editing'>
              <EditIcon />
            </IconButton>
          </Link>
        }
        title={text_en}
        subheader={text_zh}
      />
      <Divider />
      <CardContent>
        <List className={classes.folder}>
          <ListItem>
            <ListItemAvatar>
              <Avatar>
                <AssignmentIndIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary='ID' secondary={_id} />
          </ListItem>
          {statusListItem}
        </List>
      </CardContent>
    </Card>
  );
};

export default ShopTypeItem;
