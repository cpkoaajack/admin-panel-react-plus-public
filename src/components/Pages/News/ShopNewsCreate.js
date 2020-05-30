import React, { Component } from 'react';
import { Typography, Button } from '@material-ui/core';
import { Container, Row, Col, Input, Label } from 'reactstrap';
import { Link, Redirect } from 'react-router-dom';
import { BASE_URL } from '../../../constants';
import Loading from '../../Loading';
import ErrorMessage from '../../ErrorMessage';

class ShopNewsCreate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      /* Indicator */
      isFetch: false,
      isSuccess: false,
      message: '',

      /* Data - For news create */
      tagsEnabled: [],

      /* Data - Target news current setting */
      fieldTag: undefined,
      fieldImageSrc: '',
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

  fetchShopTypeTag = async () => {
    try {
      let response = await fetch(
        `${BASE_URL}/admin/tags/get?status=enabled&type=shop`,
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
        this.setState({
          tagsEnabled: response.data,
        });
      }

      this.setState({ isFetch: true });
    } catch (error) {
      console.log(error);

      this.setState({ message: 'No response from server' });
    }
  };

  fetchShopNewsCreateRequest = async () => {
    const { fieldTag, fieldImageSrc } = this.state;

    try {
      let response = await fetch(`${BASE_URL}/admin/news/create`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'shop',
          tag: fieldTag,
          imageSrc: fieldImageSrc,
        }),
      });

      response = await response.json();

      if (response.success && response.data) {
        console.log('Shop News Create Success');

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

      //console.log(response);
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

  handleShopNewsCreate = async (event) => {
    event.preventDefault();

    let response;

    try {
      response = await this.UserRoleCheck(localStorage.adminAccessToken);

      if (response) {
        console.log('User Role Verified Success');

        response = await this.fetchShopNewsCreateRequest();
      } else {
        console.log('Shop News Create Failed: User Role Verified Failed');

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

  handleUpload = (event) => {
    this.handleUploadImage(event.target.files);
  };

  createFormData = (images, body = {}) => {
    const data = new FormData();

    let fileType = 'jpg';
    const timestamp = Date.now();
    const name = this.state.fieldName;

    images.map((i, index) => {
      const fileName = `${timestamp}-${name}-${index}.${fileType}`;
      data.append('images', i, fileName);
      // data.append('images', {
      //   ...i,
      //   name: `${timestamp}-${name}-${index}.${fileType}`,
      //   type: `image/${fileType}`,
      //   // uri: this.getObjectURL(i)
      // });
    });

    Object.keys(body).forEach((key) => {
      data.append(key, body[key]);
    });

    return data;
  };

  getObjectURL = (file) => {
    var url = null;
    if (window.createObjcectURL !== undefined) {
      url = window.createOjcectURL(file);
    } else if (window.URL !== undefined) {
      url = window.URL.createObjectURL(file);
    } else if (window.webkitURL !== undefined) {
      url = window.webkitURL.createObjectURL(file);
    }

    return url;
  };

  handleUploadImage = async (images) => {
    // Upload image
    let response;
    try {
      response = await fetch(BASE_URL + '/admin/uploadImages', {
        method: 'POST',
        body: this.createFormData([...images]),
        // headers: {
        //   Accept: 'application/json',
        //   'Content-Type': 'multipart/form-data',
        // },
      });

      response = await response.json();

      if (response.success === true && response.data.length > 0) {
        if (response.data.length > 1) {
          const ImgArr = response.data.map((item) => {
            return item.location;
          });
          this.setState({
            fieldImageArray: ImgArr,
          });
        } else {
          this.setState({
            fieldImageSrc: response.data[0].location,
          });
        }
      }
    } catch (error) {
      console.log(error);
      alert('Upload images Failed. Please try again.');
      return;
    }
  };

  componentDidMount() {
    this.fetchShopTypeTag();
  }

  render() {
    const { isFetch, isSuccess } = this.state;
    const loading = <Loading />;
    const { tagsEnabled, message } = this.state;

    if (isSuccess) return <Redirect to='/dashboard/news?page=1' />;

    if (message)
      return (
        <ErrorMessage
          open={true}
          message={message}
          handleClose={() => this.setState({ message: '' })}
        />
      );

    if (!isFetch) {
      return <div className='loader-list'>{loading}</div>;
    } else {
      return (
        <div className='shop-news-create'>
          <div className='item-edit-header'>
            <header style={this.style.header}>
              <Typography component='h1' variant='h5'>
                Create Shop News
              </Typography>
            </header>
          </div>
          <div className='item-edit-body'>
            <Container>
              <form onSubmit={this.handleShopNewsCreate}>
                <div className='item-field tag-single'>
                  <Row>
                    <Col>
                      <Typography component='h1' variant='h5'>
                        Tag
                      </Typography>
                    </Col>
                    <Col>
                      <Input
                        required
                        type='select'
                        name='fieldTag'
                        onChange={this.handleInputChange}
                      >
                        <option value='' default hidden>
                          --- Select ---
                        </option>
                        {tagsEnabled.map((tag) => (
                          <option key={tag._id} value={tag._id}>
                            {`${tag.text_zh} ${tag.text_en}`}
                          </option>
                        ))}
                      </Input>
                    </Col>
                  </Row>
                </div>
                <div className='item-field photo-upload-header'>
                  <Row>
                    <Col>
                      <Typography component='h1' variant='h5'>
                        Upload Cover Image
                      </Typography>
                    </Col>
                  </Row>
                </div>
                <div className='item-field photo-upload'>
                  <Row>
                    <Col>
                      <div className='item-field custom-file'>
                        <Input
                          className='custom-file-input'
                          type='file'
                          name='fieldImageSrc'
                          label='fieldImageSrc'
                          onChange={this.handleUpload}
                          required
                          accept='.jpg'
                        />
                        <Label
                          className='custom-file-label'
                          htmlFor='customFile'
                        >
                          Only accept .jpg/ .jpeg
                        </Label>
                      </div>
                    </Col>
                  </Row>
                </div>
                <div className='item-field footer'>
                  <Row>
                    <Col>
                      <Button type='submit' variant='contained' color='primary'>
                        Submit
                      </Button>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Link style={this.style.link} to='/dashboard/news?page=1'>
                        <Button variant='contained' color='default'>
                          Cancel
                        </Button>
                      </Link>
                    </Col>
                  </Row>
                </div>
              </form>
            </Container>
          </div>
        </div>
      );
    }
  }
}

export default ShopNewsCreate;
