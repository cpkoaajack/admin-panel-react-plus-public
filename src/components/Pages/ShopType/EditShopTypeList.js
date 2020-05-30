import React, { Component } from 'react';
import { Typography } from '@material-ui/core';
import { BASE_URL } from '../../../constants';
import ReactPaginate from 'react-paginate';
import qs from 'query-string';
import ShopTypeItem from './ShopTypeItem';
import Loading from '../../Loading';
import ErrorMessage from '../../ErrorMessage';
import CreateButton from '../../CreateButton';

class EditShopTypeList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      /* Indicator */
      isFetch: false,
      itemToFetch: 'shopTypes',
      message: '',

      /* Data - For tag display */
      shopTypes: [],

      /* Pagination Config */
      limit: 6,
    };
  }

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

      if (response.success && response.data > 0) {
        const pageIndex = parseInt(this.findPaginationQueryString());
        await this.updatePaginationQueryString(pageIndex);

        const itemQuantity = response.data;
        const pages = Math.ceil(itemQuantity / limit);

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
          message: 'No Shop Type in the database',
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
        `${BASE_URL}/admin/${itemToFetch}/list?page=${page}`,
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
            shopTypes: response.data,
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

  componentDidMount() {
    this.configPagination();
  }

  handlePageClick = (data) => {
    const pageIndex = data.selected;
    const pageShown = pageIndex + 1;
    this.updatePaginationQueryString(pageShown);
    this.configPagination();
  };

  handleCloseErrorMessage = () => this.setState({ message: '' });

  render() {
    const { isFetch, itemToFetch, pageCount, shopTypes, message } = this.state;
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
        {shopTypes.map((shopType) => (
          <ShopTypeItem shopType={shopType} key={shopType._id} />
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

export default EditShopTypeList;
