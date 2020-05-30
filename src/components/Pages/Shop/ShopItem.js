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
import FastfoodIcon from '@material-ui/icons/Fastfood';
import FaceIcon from '@material-ui/icons/Face';
import PhoneIcon from '@material-ui/icons/Phone';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import RoomIcon from '@material-ui/icons/Room';
import ReorderIcon from '@material-ui/icons/Reorder';
import WorkIcon from '@material-ui/icons/Work';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import BeachAccessIcon from '@material-ui/icons/BeachAccess';
import CreateIcon from '@material-ui/icons/Create';
import UpdateIcon from '@material-ui/icons/Update';
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

const ShopItem = ({ shop }) => {
  const {
    _id,
    address,
    businessHour,
    createdAt,
    detail,
    dislike,
    district,
    imageArray,
    imageSrc,
    like,
    name,
    ownerId,
    phone,
    price,
    remark,
    status,
    tags,
    type,
    updatedAt,
  } = shop;

  const classes = useStyles();
  const [expanded, setExpanded] = React.useState({
    data: false,
    images: false,
  });

  const weekDay = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  const restDayList = weekDay
    .filter((day) => {
      return businessHour[day].restDay === true;
    })
    .map((day) => day.toUpperCase())
    .reduce((fullStr, day) => `${day}, ${fullStr}`, '')
    .slice(0, -2);

  const workDayList = weekDay
    .filter((day) => {
      return businessHour[day].restDay === false;
    })
    .map((day) => {
      return `${day.toUpperCase()}: ${new Date(
        businessHour[day].startHour
      ).getHours()} - ${new Date(businessHour[day].endHour).getHours()}`;
    })
    .reduce((fullStr, day) => `${day}, ${fullStr}`, '')
    .slice(0, -2);

  const createdAtLocal = new Date(createdAt).toLocaleString();
  const updatedAtLocal = new Date(updatedAt).toLocaleString();

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
        title={`shop_${_id}_img_gallery_${index}`}
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
          <Link to={`/dashboard/shops/${_id}`}>
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
        title={`shop_${_id}_img`}
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
              <ListItemText primary='Shop Owner ID' secondary={ownerId} />
            </ListItem>
            <ListItem>
              <ListItemAvatar>
                <Avatar>
                  <PhoneIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary='Phone' secondary={phone} />
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
              <ListItemText
                primary='Type'
                secondary={`${type['text_zh']} ${type['text_en']}`}
              />
            </ListItem>
            <ListItem>
              <ListItemAvatar>
                <Avatar>
                  <AttachMoneyIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary='Price' secondary={`${price}`} />
            </ListItem>
            <ListItem>
              <ListItemAvatar>
                <Avatar>
                  <FastfoodIcon />
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
                  <WorkIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary='Working Hours' secondary={workDayList} />
            </ListItem>
            <ListItem>
              <ListItemAvatar>
                <Avatar>
                  <BeachAccessIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary='Day Off' secondary={restDayList} />
            </ListItem>
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
        <IconButton aria-label='thumb up'>
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

export default ShopItem;
