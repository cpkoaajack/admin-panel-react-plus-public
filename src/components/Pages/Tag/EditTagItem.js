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

class EditTagItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      /* Indicator */
      isFetch: false,
      isSuccess: false,
      message: '',
      /* Data - For shop editing */
      shopTypeEnabled: [],
      /* Data - Target tag */
      tag: [],
      /* Data - Target shop current setting */
      fieldId: '',
      fieldText_en: '',
      fieldText_zh: '',
      fieldType: '',
      fieldStatus: undefined,
      fieldShopCommon: '',
      fieldShopType: '',
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

  fetchTagByParams = async () => {
    try {
      let response = await fetch(
        `${BASE_URL}/admin/tags/get?id=${this.props.match.params.id}`,
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
        this.setState({
          tag: response.data,

          fieldId: response.data[0]._id,
          fieldText_en: response.data[0].text_en,
          fieldText_zh: response.data[0].text_zh,
          fieldType: response.data[0].type,
          fieldStatus: response.data[0].status,
        });

        if (response.data[0].type === 'shop') {
          this.setState(
            {
              fieldShopCommon: response.data[0].shopCommon,
              fieldShopType: response.data[0].shopType,
            },
            () => this.fetchShopTypes()
          );
        } else {
          this.setState({ isFetch: true });
        }
      } else {
        this.setState({ message: response.message });
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

  fetchTagEditRequest = async () => {
    const {
      fieldId,
      fieldStatus,
      fieldShopType,
      fieldText_en,
      fieldText_zh,
    } = this.state;

    try {
      let response = await fetch(`${BASE_URL}/admin/tags/edit`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: fieldId,
          status: fieldStatus,
          shopType: fieldShopType,
          text_en: fieldText_en,
          text_zh: fieldText_zh,
        }),
      });

      response = await response.json();

      if (response.success && response.data) {
        console.log('Tag Edit Success');

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
    this.fetchTagByParams();
  }

  handleTagEdit = async () => {
    let response;

    try {
      response = await this.UserRoleCheck(localStorage.adminAccessToken);

      if (response) {
        console.log('User Role Verified Success');

        response = await this.fetchTagEditRequest();
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
      fieldType,
      fieldStatus,
      fieldText_en,
      fieldText_zh,
      shopTypeEnabled,
    } = this.state;

    const shopCommon = fieldType === 'shop' ? this.state.fieldShopCommon : null;

    if (isSuccess) return <Redirect to='/dashboard/tags?page=1' />;

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
        <div className='tag-edit'>
          <div className='item-edit-header'>
            <header style={this.style.header}>
              <Typography component='h1' variant='h5'>
                {`Edit Tag ${id}`}
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
                      <Row>
                        <Col>
                          <br />
                          <Typography component='h1' variant='h5'>
                            Type
                          </Typography>
                        </Col>
                        <Col>
                          <TextField
                            disabled
                            fullWidth
                            id='outlined-disabled type'
                            label='Type'
                            defaultValue={fieldType}
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
                      {fieldType === 'shop' && (
                        <React.Fragment>
                          <hr />
                          <Row>
                            <Col>
                              <br />
                              <Typography component='h1' variant='h5'>
                                Common Shop Type
                              </Typography>
                            </Col>
                            <Col>
                              <TextField
                                disabled
                                fullWidth
                                id='outlined-disabled shopCommon'
                                label='Common Tag'
                                defaultValue={this.state.fieldShopCommon}
                                variant='outlined'
                                margin='normal'
                              />
                            </Col>
                          </Row>
                        </React.Fragment>
                      )}
                      {fieldType === 'shop' && !shopCommon && (
                        <div className='item-field shop-type last-field'>
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
                                onChange={this.handleInputChange}
                                value={this.state.fieldShopType}
                              >
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
                        onClick={() => this.handleTagEdit()}
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

export default EditTagItem;
