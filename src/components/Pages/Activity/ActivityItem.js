import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import EditIcon from '@material-ui/icons/Edit';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Divider from '@material-ui/core/Divider';
import ImportantDevicesIcon from '@material-ui/icons/ImportantDevices';
import FaceIcon from '@material-ui/icons/Face';
import RoomIcon from '@material-ui/icons/Room';
import ReorderIcon from '@material-ui/icons/Reorder';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import CreateIcon from '@material-ui/icons/Create';
import UpdateIcon from '@material-ui/icons/Update';
import AlarmOnIcon from '@material-ui/icons/AlarmOn';
import AlarmOffIcon from '@material-ui/icons/AlarmOff';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import PhotoLibraryIcon from '@material-ui/icons/PhotoLibrary';

import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import BlockIcon from '@material-ui/icons/Block';

import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 900,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
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

const ActivityItem = ({ activity }) => {
  const {
    _id,
    address,
    createdAt,
    detail,
    dislike,
    district,
    end_date,
    imageArray,
    imageSrc,
    like,
    name,
    ownerId,
    remark,
    start_date,
    status,
    tags,
    type,
    updatedAt,
  } = activity;

  const classes = useStyles();
  const [expanded, setExpanded] = React.useState({
    data: false,
    images: false,
  });

  const createdAtLocal = new Date(createdAt).toLocaleString();
  const updatedAtLocal = new Date(updatedAt).toLocaleString();

  const startAtLocal = new Date(start_date).toLocaleString();
  const endAtLocal = new Date(end_date).toLocaleString();

  const tagsList = tags
    .map((tag) => tag['text_zh'])
    .reduce((list, tag) => `${tag}, ${list}`, '')
    .slice(0, -2);

  const tagsListEnglish = tags
    .map((tag) => tag['text_en'])
    .reduce((list, tag) => `${tag}, ${list}`, '')
    .slice(0, -2);

  const Images = imageArray.map((image, index) => (
    <React.Fragment key={index}>
      <CardMedia
        className={classes.media}
        image={image}
        title={`activity_${_id}_img_gallery_${index}`}
      />
      <Divider />
    </React.Fragment>
  ));

  let statusListItem;
  switch (status) {
    case 'valid':
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
    case 'invalid':
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
    case 'pending':
      statusListItem = (
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <AccessTimeIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary='Status' secondary={status} />
        </ListItem>
      );
      break;
    case 'banned':
      statusListItem = (
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <BlockIcon />
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
              <BlockIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary='Status' secondary='You will not get here' />
        </ListItem>
      );
  }

  const handleExpandClick = (target) => {
    setExpanded((expanded) => ({
      ...expanded,
      [target]: !expanded[target],
    }));
  };

  return (
    <Card className={classes.root}>
      <CardHeader
        avatar={
          <Avatar aria-label='recipe' style={stringToHslColor(name)}>
            {name.charAt(0)}
          </Avatar>
        }
        action={
          <Link to={`/dashboard/activities/${_id}`}>
            <IconButton aria-label='editing'>
              <EditIcon />
            </IconButton>
          </Link>
        }
        title={`${name} ID:${_id}`}
        subheader={address}
      />
      <CardMedia
        className={classes.media}
        image={imageSrc}
        title={`activity_${_id}_img`}
      />
      <CardContent>
        <List className={classes.folder}>
          {statusListItem}

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
          <ListItem>
            <ListItemAvatar>
              <Avatar>
                <AlarmOnIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary='Start Day And Time'
              secondary={startAtLocal}
            />
          </ListItem>
          <ListItem>
            <ListItemAvatar>
              <Avatar>
                <AlarmOffIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary='End Day And Time' secondary={endAtLocal} />
          </ListItem>
        </List>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label='thumb up'>
          <ThumbUpIcon />
          <div style={{ paddingLeft: '0.5rem' }}>{like}</div>
        </IconButton>
        <IconButton aria-label='thumb down'>
          <ThumbDownIcon />
          <div style={{ paddingLeft: '0.5rem' }}>{dislike}</div>
        </IconButton>
        <IconButton
          className={clsx(classes.expand, {
            [classes.expandOpen]: expanded.data,
          })}
          onClick={() => handleExpandClick('data')}
          aria-expanded={expanded.data}
          aria-label='show more'
        >
          <ExpandMoreIcon />
        </IconButton>
      </CardActions>
      <Collapse in={expanded.data} timeout='auto' unmountOnExit>
        <CardContent>
          <List className={classes.folder}>
            <ListItem>
              <ListItemAvatar>
                <Avatar>
                  <FaceIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary='Activity Owner ID' secondary={ownerId} />
            </ListItem>
            <ListItem>
              <ListItemAvatar>
                <Avatar>
                  <RoomIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary='District'
                secondary={`${district['text_zh']} ${district['text_en']}`}
              />
            </ListItem>
            <ListItem>
              <ListItemAvatar>
                <Avatar>
                  <ReorderIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary='Type' secondary={type} />
            </ListItem>
            <ListItem>
              <ListItemAvatar>
                <Avatar>
                  <ImportantDevicesIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary='Details' secondary={detail} />
            </ListItem>
            {remark ? (
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <AttachFileIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary='Remark' secondary={remark} />
              </ListItem>
            ) : null}
            <ListItem>
              <ListItemAvatar>
                <Avatar>
                  <LocalOfferIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary='Tags'
                secondary={tags.length > 0 ? tagsList : 'None'}
              />
            </ListItem>
            <ListItem>
              <ListItemAvatar>
                <Avatar>
                  <LocalOfferIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary='Tags (English)'
                secondary={tags.length > 0 ? tagsListEnglish : 'None'}
              />
            </ListItem>
          </List>
        </CardContent>
      </Collapse>
      <CardActions disableSpacing>
        <IconButton aria-label='gallery'>
          <PhotoLibraryIcon />
          <div style={{ paddingLeft: '0.5rem' }}>Gallery</div>
        </IconButton>
        <IconButton
          className={clsx(classes.expand, {
            [classes.expandOpen]: expanded.images,
          })}
          onClick={() => handleExpandClick('images')}
          aria-expanded={expanded.images}
          aria-label='show more'
        >
          <ExpandMoreIcon />
        </IconButton>
      </CardActions>
      <Collapse in={expanded.images} timeout='auto' unmountOnExit>
        <CardContent>{Images}</CardContent>
      </Collapse>
    </Card>
  );
};

export default ActivityItem;
