import React, { Component } from 'react';
import { Typography, Button, TextField } from '@material-ui/core';
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
  Input,
} from 'reactstrap';
import { Link, Redirect } from 'react-router-dom';
import { BASE_URL } from '../../../constants';
import Loading from '../../Loading';
import ErrorMessage from '../../ErrorMessage';

class EditShopTypeItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      /* Indicator */
      isFetch: false,
      isSuccess: false,
      message: '',
      /* Data - Target shop type */
      shopType: [],
      /* Data - Target shop type current setting */
      fieldId: '',
      fieldText_en: '',
      fieldText_zh: '',
      fieldStatus: undefined,
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

  fetchShopTypeByParams = async () => {
    try {
      let response = await fetch(
        `${BASE_URL}/admin/shopTypes/all?id=${this.props.match.params.id}`,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }
      );

      response = await response.json();

      if (response.success && response.data) {
        this.setState(
          {
            shopType: response.data,
            fieldId: response.data[0]._id,
            fieldText_en: response.data[0].text_en,
            fieldText_zh: response.data[0].text_zh,
            fieldStatus: response.data[0].status,
          },
          () => this.setState({ isFetch: true })
        );
      } else {
        this.setState({ message: response.message });
      }
    } catch (error) {
      console.log(error);

      this.setState({ message: 'No response from server' });
    }
  };

  fetchShopTypeEditRequest = async () => {
    const { fieldId, fieldStatus, fieldText_en, fieldText_zh } = this.state;

    try {
      let response = await fetch(`${BASE_URL}/admin/shopTypes/edit`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: fieldId,
          status: fieldStatus,
          text_en: fieldText_en,
          text_zh: fieldText_zh,
        }),
      });

      response = await response.json();

      if (response.success && response.data) {
        console.log('Shop Type Edit Success');

        this.setState({
          isSuccess: true,
        });
      } else if (!response.success) {
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

  componentDidMount() {
    this.fetchShopTypeByParams();
  }

  handleShopTypeEdit = async () => {
    let response;

    try {
      response = await this.UserRoleCheck(localStorage.adminAccessToken);

      if (response) {
        console.log('User Role Verified Success');

        response = await this.fetchShopTypeEditRequest();
      } else {
        console.log('Tag Edit Failed: User Role Verified Failed');

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
    const { id } = this.props.match.params;
    const { isFetch, isSuccess } = this.state;
    const loading = <Loading />;
    const {
      message,
      fieldId,
      fieldStatus,
      fieldText_en,
      fieldText_zh,
    } = this.state;

    if (isSuccess) return <Redirect to='/dashboard/shopTypes?page=1' />;

    if (!isFetch) return <div className='loader-list'>{loading}</div>;

    const boarder = fieldStatus === 'enabled' ? 'success' : 'danger';

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
        <div className='shop-type-edit'>
          <div className='item-edit-header'>
            <header style={this.style.header}>
              <Typography component='h1' variant='h5'>
                {`Edit Shop Type ${id}`}
              </Typography>
            </header>
          </div>
          <div className='item-edit-body'>
            <div className='local-container'>
              <Container>
                <form>
                  <Card outline color={boarder}>
                    <CardHeader>
                      <div className='edit-tag-name'>
                        <Row>
                          <Col>
                            <TextField
                              label='Name (English)'
                              name='fieldText_en'
                              required
                              placeholder='Name (English)'
                              value={fieldText_en}
                              onChange={this.handleInputChange}
                              variant='outlined'
                              margin='normal'
                            />
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            <TextField
                              label='Name (Chinese)'
                              name='fieldText_zh'
                              required
                              placeholder='Name (Chinese)'
                              value={fieldText_zh}
                              onChange={this.handleInputChange}
                              variant='outlined'
                              margin='normal'
                            />
                          </Col>
                        </Row>
                      </div>
                    </CardHeader>
                    <CardBody>
                      <Row>
                        <Col>
                          <br />
                          <Typography component='h1' variant='h5'>
                            ID
                          </Typography>
                        </Col>
                        <Col>
                          <TextField
                            disabled
                            fullWidth
                            label='ID'
                            defaultValue={fieldId}
                            variant='outlined'
                            margin='normal'
                          />
                        </Col>
                      </Row>
                      <div className='item-field status last-field'>
                        <Row>
                          <Col>
                            <Typography component='h1' variant='h5'>
                              Status
                            </Typography>
                          </Col>
                          <Col>
                            <Input
                              type='select'
                              required
                              name='fieldStatus'
                              onChange={this.handleInputChange}
                              value={fieldStatus}
                            >
                              <option value='enabled'>Enabled</option>
                              <option value='disabled'>Disabled</option>
                            </Input>
                          </Col>
                        </Row>
                      </div>
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
                        onClick={() => this.handleShopTypeEdit()}
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

export default EditShopTypeItem;
