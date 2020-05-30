import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Divider from '@material-ui/core/Divider';
import CreateIcon from '@material-ui/icons/Create';
import UpdateIcon from '@material-ui/icons/Update';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import LocalActivityIcon from '@material-ui/icons/LocalActivity';
import StorefrontIcon from '@material-ui/icons/Storefront';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 900,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
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
  let hue = (hash * hash) % 360;
  return { backgroundColor: `hsl(${hue}, ${s}%, ${l}%)` };
};

const NewsItem = ({ _new }) => {
  const { _id, createdAt, imageSrc, tag, type, updatedAt } = _new;

  const classes = useStyles();

  const createdAtLocal = new Date(createdAt).toLocaleString();
  const updatedAtLocal = new Date(updatedAt).toLocaleString();

  let typeListItem;
  switch (type) {
    case 'activity':
      typeListItem = (
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <LocalActivityIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary='Type' secondary={type} />
        </ListItem>
      );
      break;
    case 'shop':
      typeListItem = (
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <StorefrontIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary='Type' secondary={type} />
        </ListItem>
      );
      break;
    default:
      typeListItem = (
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <StorefrontIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary='Type' secondary='You will not get here' />
        </ListItem>
      );
  }

  return (
    <Card className={classes.root}>
      <CardHeader
        avatar={
          <Avatar aria-label='recipe' style={stringToHslColor(_id)}>
            {_id.charAt(0)}
          </Avatar>
        }
        title={`News ${_id}`}
      />
      <CardMedia
        className={classes.media}
        image={imageSrc}
        title={`news_${_id}_img`}
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
          {typeListItem}
          <ListItem>
            <ListItemAvatar>
              <Avatar>
                <LocalOfferIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary='Tag'
              secondary={`${tag['text_zh']} ${tag['text_en']}`}
            />
          </ListItem>
          <ListItem>
            <ListItemAvatar>
              <Avatar>
                <CreateIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary='Create At' secondary={createdAtLocal} />
          </ListItem>
          <ListItem>
            <ListItemAvatar>
              <Avatar>
                <UpdateIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary='Update At' secondary={updatedAtLocal} />
          </ListItem>
        </List>
      </CardContent>
    </Card>
  );
};

export default NewsItem;
