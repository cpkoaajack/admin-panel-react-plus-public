import React, { Component } from 'react';
import { Button, TextField, Typography } from '@material-ui/core';
import {
  Container,
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  Input,
} from 'reactstrap';
import { Link, Redirect } from 'react-router-dom';
import { BASE_URL } from '../../../constants';
import Loading from '../../Loading';
import ErrorMessage from '../../ErrorMessage';

class ShopTagCreate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      /* Indicator */
      isFetch: false,
      isSuccess: false,
      message: '',
      /* Field value */
      fieldText_en: '',
      fieldText_zh: '',
      fieldTagCommon: true,
      fieldShopType: undefined,
      /* Data - For tag creating */
      shopTypeEnabled: [],
    };
  }

  style = {
    header: {
      background: '#333',
      color: '#fff',
      textAlign: 'center',
      padding: '10px',
    },
    link: {
      textDecoration: 'none',
    },
  };

  fetchTagShopCreateRequest = async () => {
    const {
      fieldText_en,
      fieldText_zh,
      fieldTagCommon,
      fieldShopType,
    } = this.state;

    try {
      let response = await fetch(`${BASE_URL}/admin/tags/create`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'shop',
          shopCommon: fieldTagCommon,
          shopType: fieldShopType,
          text_en: fieldText_en,
          text_zh: fieldText_zh,
        }),
      });

      response = await response.json();

      if (response.success) {
        console.log('Shop Tag Create Success');

        this.setState({
          isSuccess: true,
        });
      } else {
        console.log('Shop Tag Create Failed:', response.message);
        this.setState({
          message: response.message,
        });
      }
    } catch (error) {
      console.log(error);

      this.setState({ message: 'No response from server' });
    }
  };

  fetchShopTypes = async () => {
    try {
      let response = await fetch(`${BASE_URL}/admin/shopTypes/enabled`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      response = await response.json();

      if (response.success && response.data.length > 0) {
        this.setState(
          {
            shopTypeEnabled: response.data.map((item) => ({
              _id: item._id,
              text_en: item.text_en,
              text_zh: item.text_zh,
            })),
          },
          () =>
            this.setState({
              isFetch: true,
            })
        );
      } else {
        this.setState({ message: response.message });
      }
    } catch (error) {
      console.log(error);

      this.setState({ message: 'No response from server' });
    }
  };

  UserRoleCheck = async (token) => {
    let response;

    try {
      response = await fetch(`${BASE_URL}/user?token=${token}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      response = await response.json();

      if (response.success && response.data.role === 'admin') {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error(error);

      this.setState({ message: 'No response from server' });
    }
  };

  handleShopTagCreate = async () => {
    let response;

    try {
      response = await this.UserRoleCheck(localStorage.adminAccessToken);

      if (response) {
        console.log('User Role Verified Success');

        response = await this.fetchTagShopCreateRequest();
      } else {
        console.log('Tag Create Failed: User Role Verified Failed');

        this.setState({ message: 'Account is not admin' });
      }
    } catch (error) {
      console.log(error);

      this.setState({ message: 'No response from server' });
    }
  };

  handleInputChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleCommonChange = (event) => {
    event.target.value === 'true'
      ? this.setState({ fieldShopType: undefined, [event.target.name]: true })
      : this.setState({ [event.target.name]: false });
  };

  componentDidMount() {
    this.fetchShopTypes();
  }

  render() {
    const { isFetch, isSuccess } = this.state;
    const {
      fieldText_en,
      fieldText_zh,
      fieldTagCommon,
      fieldShopType,
      shopTypeEnabled,
      message,
    } = this.state;
    const loading = <Loading />;

    if (isSuccess) return <Redirect to='/dashboard/tags?page=1' />;

    if (!isFetch) return <div className='loader-list'>{loading}</div>;

    if (message) {
      return (
        <ErrorMessage
          open={true}
          message={message}
          handleClose={() => this.setState({ message: '' })}
        />
      );
    } else {
      return (
        <div className='tag-create'>
          <div className='item-edit-header'>
            <header style={this.style.header}>
              <Typography component='h1' variant='h5'>
                Create Shop Tag
              </Typography>
            </header>
          </div>
          <div className='item-edit-body'>
            <div className='local-container'>
              <Container>
                <form>
                  <Card outline color='success'>
                    <CardHeader>
                      <div className='edit-tag-name'>
                        <Row>
                          <Col>
                            <TextField
                              variant='outlined'
                              margin='normal'
                              type='text'
                              name='fieldText_en'
                              placeholder='Name (English)'
                              required
                              label='Name (English)'
                              value={fieldText_en}
                              onChange={this.handleInputChange}
                            />
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            <TextField
                              variant='outlined'
                              margin='normal'
                              type='text'
                              name='fieldText_zh'
                              placeholder='Name (Chinese)'
                              required
                              label='Name (Chinese)'
                              value={fieldText_zh}
                              onChange={this.handleInputChange}
                            />
                          </Col>
                        </Row>
                      </div>
                    </CardHeader>
                    <CardBody>
                      <div className='item-field common-shop-tag last-field'>
                        <Row>
                          <Col>
                            <Typography component='h1' variant='h5'>
                              Common Type Shop
                            </Typography>
                          </Col>
                          <Col>
                            <Input
                              type='select'
                              required
                              name='fieldTagCommon'
                              value={fieldTagCommon}
                              onChange={this.handleCommonChange}
                            >
                              <option value='true'>Yes</option>
                              <option value='false'>No</option>
                            </Input>
                          </Col>
                        </Row>
                      </div>
                      {!fieldTagCommon && (
                        <div className='item-field tag-shop-type last-field'>
                          <Row>
                            <Col>
                              <Typography component='h1' variant='h5'>
                                Shop Type
                              </Typography>
                            </Col>
                            <Col>
                              <Input
                                type='select'
                                required
                                name='fieldShopType'
                                value={fieldShopType}
                                onChange={this.handleInputChange}
                              >
                                <option value='' default hidden>
                                  --- Select ---
                                </option>
                                {shopTypeEnabled.map((item) => (
                                  <option key={item._id} value={item._id}>
                                    {`${item.text_zh} ${item.text_en}`}
                                  </option>
                                ))}
                              </Input>
                            </Col>
                          </Row>
                        </div>
                      )}
                    </CardBody>
                  </Card>
                </form>
                <div className='item-field footer'>
                  <Row>
                    <Col>
                      <Button
                        type='submit'
                        variant='contained'
                        color='primary'
                        onClick={() => this.handleShopTagCreate()}
                      >
                        Submit
                      </Button>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Link style={this.style.link} to='/dashboard/tags?page=1'>
                        <Button variant='contained' color='default'>
                          Cancel
                        </Button>
                      </Link>
                    </Col>
                  </Row>
                </div>
              </Container>
            </div>
          </div>
        </div>
      );
    }
  }
}

export default ShopTagCreate;
