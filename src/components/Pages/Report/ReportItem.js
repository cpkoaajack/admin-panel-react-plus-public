import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
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
import FaceIcon from '@material-ui/icons/Face';
import LocalActivityIcon from '@material-ui/icons/LocalActivity';
import StorefrontIcon from '@material-ui/icons/Storefront';

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

const ReportItem = ({ report }) => {
  const { createdAt, reporter, detail, type, updatedAt } = report;
  let shop = type === 'shop' ? report.shop : null;
  let activity = type === 'activity' ? report.activity : null;

  const classes = useStyles();

  const createdAtLocal = new Date(createdAt).toLocaleString();
  const updatedAtLocal = new Date(updatedAt).toLocaleString();

  let typeListItem;
  switch (type) {
    case 'activity':
      typeListItem = (
        <React.Fragment>
          <ListItem>
            <ListItemAvatar>
              <Avatar>
                <LocalActivityIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary='Report Type' secondary={type} />
          </ListItem>
          <Link
            style={{ textDecoration: 'none' }}
            to={`/dashboard/activities/${activity['_id']}`}
          >
            <ListItem>
              <ListItemAvatar>
                <Avatar>
                  <LocalActivityIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary='Activity ID' secondary={activity['_id']} />
            </ListItem>
            <ListItem>
              <ListItemAvatar>
                <Avatar>
                  <LocalActivityIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary='Activity Name'
                secondary={activity['name']}
              />
            </ListItem>
          </Link>
        </React.Fragment>
      );
      break;
    case 'shop':
      typeListItem = (
        <React.Fragment>
          <ListItem>
            <ListItemAvatar>
              <Avatar>
                <StorefrontIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary='Report Type' secondary={type} />
          </ListItem>
          <Link
            style={{ textDecoration: 'none' }}
            to={`/dashboard/shops/${shop['_id']}`}
          >
            <ListItem>
              <ListItemAvatar>
                <Avatar>
                  <StorefrontIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary='Shop ID' secondary={shop['_id']} />
            </ListItem>
            <ListItem>
              <ListItemAvatar>
                <Avatar>
                  <StorefrontIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary='Shop Name' secondary={shop['name']} />
            </ListItem>
          </Link>
        </React.Fragment>
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
          <Avatar aria-label='recipe' style={stringToHslColor(detail)}>
            {detail.charAt(0)}
          </Avatar>
        }
        title={detail}
      />
      <Divider />
      <CardContent>
        <List className={classes.folder}>
          <ListItem>
            <ListItemAvatar>
              <Avatar>
                <FaceIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary='Reporter ID' secondary={reporter['_id']} />
          </ListItem>
          <ListItem>
            <ListItemAvatar>
              <Avatar>
                <FaceIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary='Reporter Name'
              secondary={reporter['name']}
            />
          </ListItem>
          <ListItem>
            <ListItemAvatar>
              <Avatar>
                <AssignmentIndIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary='Reporter Role'
              secondary={reporter['role']}
            />
          </ListItem>
          {typeListItem}
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

export default ReportItem;
