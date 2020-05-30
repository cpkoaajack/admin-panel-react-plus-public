import React, { Component } from 'react';
import { Button, TextField, Typography } from '@material-ui/core';
import { Container, Row, Col, Card, CardHeader } from 'reactstrap';
import { BASE_URL } from '../../../constants';
import { Link, Redirect } from 'react-router-dom';
import ErrorMessage from '../../ErrorMessage';

class ShopTypeCreate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      /* Indicator */
      isSuccess: false,
      message: '',
      /* Field value */
      fieldText_en: '',
      fieldText_zh: '',
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

  fetchShopTypeCreateRequest = async () => {
    const { fieldText_en, fieldText_zh } = this.state;

    try {
      let response = await fetch(`${BASE_URL}/admin/shopTypes/create`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text_en: fieldText_en,
          text_zh: fieldText_zh,
        }),
      });

      response = await response.json();

      if (response.success) {
        console.log('Shop Type Create Success');

        this.setState({
          isSuccess: true,
        });
      } else {
        console.log('Shop Type Create Failed:', response.message);
        this.setState({
          message: response.message,
        });
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

  handleShopTypeCreate = async () => {
    let response;

    try {
      response = await this.UserRoleCheck(localStorage.adminAccessToken);

      if (response) {
        console.log('User Role Verified Success');

        response = await this.fetchShopTypeCreateRequest();
      } else {
        console.log('Shop Type Create Failed: User Role Verified Failed');

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

  render() {
    const { isSuccess, fieldText_en, fieldText_zh, message } = this.state;

    if (isSuccess) return <Redirect to='/dashboard/shopTypes?page=1' />;

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
        <div className='shop-type-create'>
          <div className='item-edit-header'>
            <header style={this.style.header}>
              <Typography component='h1' variant='h5'>
                Create Shop Type
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
                  </Card>
                </form>
                <div className='item-field footer'>
                  <Row>
                    <Col>
                      <Button
                        type='submit'
                        variant='contained'
                        color='primary'
                        onClick={() => this.handleShopTypeCreate()}
                      >
                        Submit
                      </Button>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Link
                        style={this.style.link}
                        to='/dashboard/shopTypes?page=1'
                      >
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

export default ShopTypeCreate;
