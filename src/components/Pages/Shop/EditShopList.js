import React, { Component } from 'react';
import { Typography } from '@material-ui/core';
import { BASE_URL } from '../../../constants';
import ReactPaginate from 'react-paginate';
import qs from 'query-string';
import ShopItem from './ShopItem';
import Loading from '../../Loading';
import ErrorMessage from '../../ErrorMessage';
import CreateButton from '../../CreateButton';

class EditShopList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      /* Indicator */
      isFetch: false,
      itemToFetch: 'shops',
      message: '',

      /* Data - For shop creation */
      tags: [],
      districts: [],
      shopTypes: [],

      /* Data - For shop display */
      shops: [],

      /* Pagination Config */
      limit: 4,
    };
  }

  /*
  Do:
  1. Check for qurey and fetch the page specify from the qurey
  2. Check qurey is valid or not to determine fetch or reset qurey
  3. Handle whether the data is fetched and finish setState
  */
  configPagination = async () => {
    const { itemToFetch, limit } = this.state;

    this.setState({ isFetch: false });

    try {
      let response = await fetch(`${BASE_URL}/admin/${itemToFetch}/quantity`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      response = await response.json();

      /* 
      When first enter the list, qurey will always be page=1
      */
      if (response.success && response.data > 0) {
        /* 
        If the fetch request tells there are items in database,
        grab the current page index and fetch the data with pagination using that index
        */
        const pageIndex = parseInt(this.findPaginationQueryString());
        await this.updatePaginationQueryString(pageIndex);

        const itemQuantity = response.data;
        const pages = Math.ceil(itemQuantity / limit);

        /*
        Check if the page index is valid, if not, data will not fetch
        also, qurey will set to page=undefined with a corresponding message to notice the user
        */
        if (pageIndex <= pages) {
          this.setState(
            {
              count: itemQuantity,
              pageCount: pages,
            },
            () => this.fetchDataWithPagination(pageIndex)
          );
        } else {
          await this.updatePaginationQueryString();

          this.setState({
            message: 'Page number is invalid',
          });
        }
      } else if (response.success) {
        await this.updatePaginationQueryString();

        this.setState({
          message: 'No shop in the database',
        });
      } else {
        await this.updatePaginationQueryString();

        this.setState({
          message: response.message,
        });
      }
    } catch (error) {
      console.log(error);

      this.setState({ message: 'No response from server' });
    }
  };

  fetchDataWithPagination = async (page) => {
    const { itemToFetch } = this.state;
    try {
      let response = await fetch(
        `${BASE_URL}/admin/${itemToFetch}/get?page=${page}`,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }
      );

      response = await response.json();

      if (response.success && response.data.length > 0) {
        this.setState(
          {
            shops: response.data,
          },
          () =>
            this.setState({
              isFetch: true,
            })
        );
      }
    } catch (error) {
      console.error(error);

      this.setState({ message: 'No response from server' });
    }
  };

  findPaginationQueryString = () => {
    const queryString = qs.parse(this.props.location.search);
    return queryString['page'];
  };

  updatePaginationQueryString = async (page = undefined) => {
    const pathname = this.props.location.pathname;
    await this.props.history.push({
      pathname: pathname,
      search: `?page=${page}`,
    });
  };

  /* 
  Fetch tags which is shop type from DB
  Tags can be empty array if no tag avaliable
  */
  fetchShopTypeTag = async () => {
    try {
      let response = await fetch(`${BASE_URL}/admin/tags/get?type=shop`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      response = await response.json();

      if (response.success && response.data.length > 0) {
        this.setState({
          tags: response.data,
        });
      }
    } catch (error) {
      console.log(error);

      this.setState({ message: 'No response from server' });
    }
  };

  /* 
  Fetch districts from DB
  Districts would not be empty
  */
  fetchDistricts = async () => {
    try {
      let response = await fetch(`${BASE_URL}/admin/district`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      response = await response.json();

      if (response.success && response.data.length > 0) {
        this.setState({
          districts: response.data,
        });
      }
    } catch (error) {
      console.log(error);

      this.setState({ message: 'No response from server' });
    }
  };

  /* 
 Fetch shop type from DB
 ShopTypes can be empty array if no shop type avaliable
 */
  fetchShopTypes = async () => {
    try {
      let response = await fetch(`${BASE_URL}/admin/shopTypes/all`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      response = await response.json();

      if (response.success && response.data.length > 0) {
        this.setState({
          shopTypes: response.data,
        });
      }
    } catch (error) {
      console.log(error);

      this.setState({ message: 'No response from server' });
    }
  };

  componentDidMount() {
    this.configPagination();
  }

  /* 
  PageIndex (data.selected) is a array index starting from 0
  So must add 1 before update the new qurey string
   */
  handlePageClick = (data) => {
    const pageIndex = data.selected;
    const pageShown = pageIndex + 1;
    this.updatePaginationQueryString(pageShown);
    this.configPagination();
  };

  handleCloseErrorMessage = () => this.setState({ message: '' });

  render() {
    const { isFetch, itemToFetch, pageCount, shops, message } = this.state;
    const currentPage = parseInt(this.findPaginationQueryString());
    const pageIndex = currentPage - 1;

    const pagination = (
      <React.Fragment>
        <div className='react-pagination-package'>
          <ReactPaginate
            previousLabel={'<'}
            nextLabel={'>'}
            breakLabel={'...'}
            pageCount={pageCount}
            forcePage={pageIndex}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={this.handlePageClick}
            breakClassName={'page-item'}
            breakLinkClassName={'page-link'}
            containerClassName={'pagination'}
            pageClassName={'page-item'}
            pageLinkClassName={'page-link'}
            previousClassName={'page-item'}
            previousLinkClassName={'page-link'}
            nextClassName={'page-item'}
            nextLinkClassName={'page-link'}
            activeClassName={'active'}
          />
        </div>
        <Typography component='h1' variant='h5'>
          {currentPage} / {pageCount}
        </Typography>
      </React.Fragment>
    );
    const content = (
      <div className='content-main'>
        {shops.map((shop) => (
          <ShopItem shop={shop} key={shop._id} />
        ))}
      </div>
    );
    const loading = <Loading />;

    if (message)
      return (
        <ErrorMessage
          open={true}
          message={message}
          handleClose={this.handleCloseErrorMessage}
        />
      );

    if (!isFetch) {
      return <div className='loader-list'>{loading}</div>;
    } else {
      return (
        <div className='local-container'>
          <div className='item-list'>
            <div className='item-list-create'>
              <CreateButton destination={`/dashboard/${itemToFetch}/create`} />
            </div>
            <div className='list-pagination-top'>
              {pageCount > 1 ? pagination : null}
            </div>
            {content}
            <div className='list-pagination-bottom'>
              {pageCount > 1 ? pagination : null}
            </div>
          </div>
        </div>
      );
    }
  }
}

export default EditShopList;
