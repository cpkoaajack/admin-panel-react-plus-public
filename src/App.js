import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { PrivateRoute } from './PrivateRoute';

//============================================Navigation Bar========================================================

import NavigationBar from './components/NavigationBar';

//=======================================================Login======================================================

import Login from './components/Login';

//=======================================================Home=======================================================

import Dashboard from './components/Dashboard';

//=======================================================Shop=======================================================

import ShopCreate from './components/Pages/Shop/ShopCreate';
import EditShopList from './components/Pages/Shop/EditShopList';
import ShopItemEdit from './components/Pages/Shop/ShopItemEdit';

//=======================================================Activity===================================================

import ActivityCreate from './components/Pages/Activity/ActivityCreate';
import EditActivityList from './components/Pages/Activity/EditActivityList';
import ActivityItemEdit from './components/Pages/Activity/ActivityItemEdit';
import ActivityApprove from './components/Pages/Activity/ActivityApprove';

//=======================================================Tag========================================================

import ActivityTagCreate from './components/Pages/Tag/ActivityTagCreate';
import ShopTagCreate from './components/Pages/Tag/ShopTagCreate';
import EditTagList from './components/Pages/Tag/EditTagList';
import TagItemEdit from './components/Pages/Tag/EditTagItem';

//=======================================================News=======================================================

import ActivityNewsCreate from './components/Pages/News/ActivityNewsCreate';
import ShopNewsCreate from './components/Pages/News/ShopNewsCreate';
import EditNewsList from './components/Pages/News/EditNewsList';

//=======================================================Shop Type===================================================

import ShopTypeCreate from './components/Pages/ShopType/ShopTypeCreate';
import EditShopTypeList from './components/Pages/ShopType/EditShopTypeList';
import ShopTypeItemEdit from './components/Pages/ShopType/EditShopTypeItem';

//=======================================================Report======================================================

import ViewReportList from './components/Pages/Report/ViewReportList';

//========================================================CSS========================================================

import './App.css';

//=======================================================Class Component=============================================

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      idToEdit: undefined,
    };
  }

  recordEditID = (id) => {
    this.setState({ idToEdit: id });
  };

  render() {
    return (
      <div className='application-container'>
        <Router>
          {/* Login */}
          <div className='application-container-middle'>
            <Route exact path='/' component={Login} />
          </div>
          {/* Navigation */}

          <PrivateRoute path='/dashboard' component={NavigationBar} />
          <PrivateRoute exact path='/dashboard' component={Dashboard} />

          {/* Shop */}

          <Switch>
            <PrivateRoute
              exact
              path='/dashboard/shops'
              component={EditShopList}
            />
            <PrivateRoute
              path='/dashboard/shops/create'
              component={ShopCreate}
            />
            <PrivateRoute
              path='/dashboard/shops/:id'
              component={ShopItemEdit}
            />
          </Switch>

          {/* Activity */}

          <Switch>
            <PrivateRoute
              exact
              path='/dashboard/activities'
              component={EditActivityList}
            />
            <PrivateRoute
              path='/dashboard/activities/approve'
              component={ActivityApprove}
            />
            <PrivateRoute
              path='/dashboard/activities/create'
              component={ActivityCreate}
            />
            <PrivateRoute
              path='/dashboard/activities/:id'
              component={ActivityItemEdit}
            />
          </Switch>

          {/* Old activity approve route - Just for reference
            <PrivateRoute
              path='/admin/activities/approve'
              component={() => {
                window.location.href = `${BASE_URL}/admin/activities/approve`;
                return null;
              }}
            /> */}

          {/* Tag */}

          <Switch>
            <PrivateRoute
              exact
              path='/dashboard/tags'
              component={EditTagList}
            />
            <PrivateRoute
              path='/dashboard/tags/create/activity'
              component={ActivityTagCreate}
            />
            <PrivateRoute
              path='/dashboard/tags/create/shop'
              component={ShopTagCreate}
            />
            <PrivateRoute path='/dashboard/tags/:id' component={TagItemEdit} />
          </Switch>

          {/* News */}

          <Switch>
            <PrivateRoute
              exact
              path='/dashboard/news'
              component={EditNewsList}
            />
            <PrivateRoute
              path='/dashboard/news/create/activity'
              component={ActivityNewsCreate}
            />
            <PrivateRoute
              path='/dashboard/news/create/shop'
              component={ShopNewsCreate}
            />
          </Switch>

          {/* ShopType */}

          <Switch>
            <PrivateRoute
              exact
              path='/dashboard/shopTypes'
              component={EditShopTypeList}
            />
            <PrivateRoute
              path='/dashboard/shopTypes/create'
              component={ShopTypeCreate}
            />
            <PrivateRoute
              path='/dashboard/shopTypes/:id'
              component={ShopTypeItemEdit}
            />
          </Switch>

          {/* Report */}

          <PrivateRoute
            exact
            path='/dashboard/reports'
            component={ViewReportList}
          />
        </Router>
      </div>
    );
  }
}

export default App;
