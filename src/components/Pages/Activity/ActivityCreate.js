import React, { Component } from 'react';
import { Typography, Button, TextField } from '@material-ui/core';
import { Container, Row, Col, Input, Label } from 'reactstrap';
import { Link, Redirect } from 'react-router-dom';
import { BASE_URL } from '../../../constants';
import Loading from '../../Loading';
import ErrorMessage from '../../ErrorMessage';

class ActivityCreate extends Component {
  constructor(props) {
    super(props);

    //Offset in milliseconds
    const tzoffset = new Date().getTimezoneOffset() * 60000;
    const localISOTime = new Date(Date.now() - tzoffset)
      .toISOString()
      .slice(0, -1);
    const localISOTimeWithoutSeconds = localISOTime.slice(0, 16);

    this.state = {
      /* Indicator */
      isFetch: false,
      isSuccess: false,
      message: '',
      /* Data - For activity editing */
      tagsEnabled: [],
      districts: [],
      /* Data - Target activity current setting */
      fieldType: '',
      fieldStatus: '',
      fieldName: '',
      fieldOwnerID: 0,
      fieldStartDate: localISOTimeWithoutSeconds,
      fieldEndDate: localISOTimeWithoutSeconds,
      fieldDistrict: '',
      fieldAddress: '',
      fieldDetail: '',
      fieldRemark: '',
      fieldTags: [],
      /*
      Advance upload options indicator - Image
      */
      fieldImageSrc: undefined,
      fieldImageArray: undefined,
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
        this.setState(
          {
            districts: response.data,
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

  fetchActivityTypeTag = async () => {
    try {
      let response = await fetch(
        `${BASE_URL}/admin/tags/get?status=enabled&type=activity`,
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
            tagsEnabled: response.data,
          },
          () => this.fetchDistricts()
        );
      } else if (response.success) {
        this.fetchDistricts();
      } else {
        this.setState({ message: response.message });
      }
    } catch (error) {
      console.log(error);

      this.setState({ message: 'No response from server' });
    }
  };

  fetchActivityCreateRequest = async () => {
    const {
      fieldOwnerID,
      fieldName,
      fieldType,
      fieldStatus,
      fieldDistrict,
      fieldAddress,
      fieldTags,
      fieldImageSrc,
      fieldImageArray,
      fieldDetail,
      fieldRemark,
      fieldStartDate,
      fieldEndDate,
    } = this.state;

    const formattedStartDate = new Date(fieldStartDate + ':00+08:00');
    const formattedEndDate = new Date(fieldEndDate + ':00+08:00');

    try {
      let response = await fetch(`${BASE_URL}/admin/activities/create`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ownerId: fieldOwnerID,
          name: fieldName,
          type: fieldType,
          status: fieldStatus,
          start_date: formattedStartDate,
          end_date: formattedEndDate,
          district: fieldDistrict,
          address: fieldAddress,
          tags: fieldTags,
          imageSrc: fieldImageSrc,
          imageArray: fieldImageArray,
          detail: fieldDetail,
          remark: fieldRemark,
        }),
      });

      response = await response.json();

      if (response.success && response.data) {
        console.log('Activity Create Success');

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

  componentDidMount() {
    this.fetchActivityTypeTag();
  }

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

  handleActivityCreate = async (event) => {
    event.preventDefault();

    let response;

    try {
      response = await this.UserRoleCheck(localStorage.adminAccessToken);

      if (response) {
        console.log('User Role Verified Success');

        response = await this.fetchActivityCreateRequest();
      } else {
        console.log('Activity Create Failed: User Role Verified Failed');

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

  handleInputMultiSelectChange = (event) => {
    let options = event.target.options;
    let value = [];
    for (let i = 0, l = options.length; i < l; i++) {
      if (options[i].selected) {
        value.push(options[i].value);
      }
    }
    this.setState({ [event.target.name]: value });
  };

  handleUpload = (event) => {
    this.handleUploadImage(event.target.name, event.target.files);
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

  handleUploadImage = async (name, images) => {
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
        if (name === 'fieldImageArray') {
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

  render() {
    const { isFetch, isSuccess } = this.state;
    const loading = <Loading />;
    const {
      message,
      tagsEnabled,
      districts,
      fieldStartDate,
      fieldEndDate,
    } = this.state;
    let startDateText = fieldStartDate.split(':');
    startDateText = `${startDateText[0]}:${startDateText[1]}`;
    let endDateText = fieldEndDate.split(':');
    endDateText = `${endDateText[0]}:${endDateText[1]}`;

    if (isSuccess) return <Redirect to='/dashboard/activities?page=1' />;

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
        <div className='activity-edit'>
          <div className='item-edit-header'>
            <header style={this.style.header}>
              <Typography component='h1' variant='h5'>
                Create Activity
              </Typography>
            </header>
          </div>
          <div className='item-edit-body'>
            <Container>
              <form onSubmit={this.handleActivityCreate}>
                <div className='item-field ownerid'>
                  <Row>
                    <Col>
                      <Typography component='h1' variant='h5'>
                        Activity Owner
                      </Typography>
                      <p>(User ID)</p>
                    </Col>
                    <Col>
                      <Input
                        type='number'
                        min='0'
                        name='fieldOwnerID'
                        placeholder='User ID'
                        label='User ID'
                        required
                        value={this.state.fieldOwnerID}
                        onChange={this.handleInputChange}
                      />
                    </Col>
                  </Row>
                </div>
                <div className='item-field activity-name'>
                  <Row>
                    <Col></Col>
                    <Col>
                      <TextField
                        variant='outlined'
                        margin='normal'
                        type='text'
                        name='fieldName'
                        placeholder='Activity Name'
                        required
                        label='Activity Name'
                        multiline
                        fullWidth
                        value={this.state.fieldName}
                        onChange={this.handleInputChange}
                      />
                    </Col>
                  </Row>
                </div>
                <div className='item-field activity-address'>
                  <Row>
                    <Col></Col>
                    <Col>
                      <TextField
                        variant='outlined'
                        margin='normal'
                        type='text'
                        name='fieldAddress'
                        placeholder='Address'
                        required
                        multiline
                        fullWidth
                        label='Address'
                        value={this.state.fieldAddress}
                        onChange={this.handleInputChange}
                      />
                    </Col>
                  </Row>
                </div>
                <div className='item-field activity-detail'>
                  <Row>
                    <Col></Col>
                    <Col>
                      <TextField
                        variant='outlined'
                        margin='normal'
                        type='text'
                        name='fieldDetail'
                        placeholder='Detail'
                        label='Detail'
                        required
                        multiline
                        fullWidth
                        value={this.state.fieldDetail}
                        onChange={this.handleInputChange}
                      />
                    </Col>
                  </Row>
                </div>
                <div className='item-field activity-remark'>
                  <Row>
                    <Col></Col>
                    <Col>
                      <TextField
                        variant='outlined'
                        margin='normal'
                        type='text'
                        name='fieldRemark'
                        placeholder='Remark'
                        label='Remark ( Optional )'
                        multiline
                        fullWidth
                        value={this.state.fieldRemark}
                        onChange={this.handleInputChange}
                      />
                    </Col>
                  </Row>
                </div>
                <div className='item-field activity-type'>
                  <Row>
                    <Col>
                      <Typography component='h1' variant='h5'>
                        Activity Type
                      </Typography>
                    </Col>
                    <Col>
                      <Input
                        type='select'
                        required
                        name='fieldType'
                        value={this.state.fieldType}
                        onChange={this.handleInputChange}
                      >
                        <option value='' default hidden>
                          --- Select ---
                        </option>
                        <option value='business'>Business</option>
                        <option value='general'>General</option>
                      </Input>
                    </Col>
                  </Row>
                </div>
                <div className='item-field activity-status'>
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
                        value={this.state.fieldStatus}
                        onChange={this.handleInputChange}
                      >
                        <option value='' default hidden>
                          --- Select ---
                        </option>
                        <option value='valid'>Valid</option>
                        <option value='invalid'>Invalid</option>
                        <option value='pending'>Pending</option>
                        <option value='banned'>Banned</option>
                      </Input>
                    </Col>
                  </Row>
                </div>
                <div className='item-field activity-districts'>
                  <Row>
                    <Col>
                      <Typography component='h1' variant='h5'>
                        District
                      </Typography>
                    </Col>
                    <Col>
                      <Input
                        type='select'
                        required
                        name='fieldDistrict'
                        value={this.state.fieldDistrict}
                        onChange={this.handleInputChange}
                      >
                        <option value='' default hidden>
                          --- Select ---
                        </option>
                        {districts.map((item) => (
                          <option key={item._id} value={item._id}>
                            {`${item.text_zh} ${item.text_en}`}
                          </option>
                        ))}
                      </Input>
                    </Col>
                  </Row>
                </div>
                {tagsEnabled.length > 0 && (
                  <div className='item-field tags'>
                    <Row>
                      <Col>
                        <Row>
                          <Col>
                            <Typography component='h1' variant='h5'>
                              Tags
                            </Typography>
                            <p>(Optional)</p>
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            <p>Please Hold Crtl To Select Multiple</p>
                          </Col>
                        </Row>
                      </Col>
                      <Col>
                        <Input
                          multiple
                          size={`${tagsEnabled.length}`}
                          type='select'
                          name='fieldTags'
                          onChange={this.handleInputMultiSelectChange}
                        >
                          <option value='' default hidden>
                            --- Select ---
                          </option>
                          {tagsEnabled.map((item) => {
                            return (
                              <option key={item._id} value={item._id}>
                                {`${item.text_zh} ${item.text_en}`}
                              </option>
                            );
                          })}
                        </Input>
                      </Col>
                    </Row>
                  </div>
                )}
                <div className='item-field start-day-and-time'>
                  <Row>
                    <Col>
                      <Typography component='h1' variant='h5'>
                        Start Date And Time :
                      </Typography>
                    </Col>
                    <Col>
                      <Input
                        type='datetime-local'
                        name='fieldStartDate'
                        required
                        value={startDateText}
                        onChange={this.handleInputChange}
                      />
                    </Col>
                  </Row>
                </div>
                <div className='item-field end-day-and-time'>
                  <Row>
                    <Col>
                      <Typography component='h1' variant='h5'>
                        End Date And Time :
                      </Typography>
                    </Col>
                    <Col>
                      <Input
                        type='datetime-local'
                        name='fieldEndDate'
                        required
                        value={endDateText}
                        onChange={this.handleInputChange}
                      />
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
                <div className='item-field photo-upload-header'>
                  <Row>
                    <Col>
                      <Typography component='h1' variant='h5'>
                        Upload Gallery
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
                          name='fieldImageArray'
                          label='fieldImageArray'
                          onChange={this.handleUpload}
                          multiple
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
                      <Link
                        style={this.style.link}
                        to='/dashboard/activities?page=1'
                      >
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

export default ActivityCreate;
