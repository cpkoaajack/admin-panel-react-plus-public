import React, { Component } from 'react';
import { Typography, Button, TextField } from '@material-ui/core';
import { Container, Row, Col, Input, Label } from 'reactstrap';
import { Link, Redirect } from 'react-router-dom';
import { BASE_URL } from '../../../constants';
import Loading from '../../Loading';
import ErrorMessage from '../../ErrorMessage';

class ActivityItemEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      /* Indicator */
      isFetch: false,
      isSuccess: false,
      message: '',
      /* Data - For activity editing */
      tagsEnabled: [],
      districts: [],
      /* Data - Target activity */
      activity: [],
      /* Data - Target activity current setting */
      fieldType: '',
      fieldStatus: '',
      fieldName: '',
      fieldOwnerID: '',
      fieldStartDate: '',
      fieldEndDate: '',
      fieldDistrict: '',
      fieldAddress: '',
      fieldDetail: '',
      fieldRemark: '',
      fieldTags: [],
      /*
      Advance upload options indicator - Image
      */
      updateCoverPhoto: false,
      updateGalleryPhoto: false,
      originalFieldImageSrc: '',
      originalFieldImageArray: [],
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

  fetchActivityByParams = async () => {
    try {
      let response = await fetch(
        `${BASE_URL}/activity/${this.props.match.params.id}`,
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
          activity: response.data,
          fieldType: response.data['type'],
          fieldStatus: response.data['status'],
          fieldName: response.data['name'],
          fieldOwnerID: response.data['ownerId'],
          fieldDistrict: response.data['district']._id,
          fieldAddress: response.data['address'],
          fieldDetail: response.data['detail'],
          originalFieldImageSrc: response.data['imageSrc'],
          originalFieldImageArray: response.data['imageArray'],
        });

        if (response.data['tags'].length > 0) {
          this.setState({ fieldTags: response.data['tags'] });
        }

        if (response.data['remark']) {
          this.setState({ fieldRemark: response.data['remark'] });
        }

        let startDateText = new Date(response.data['start_date']);
        startDateText.setHours(startDateText.getHours() + 8);
        startDateText = startDateText.toISOString().split(':');
        startDateText = `${startDateText[0]}:${startDateText[1]}`;

        let endDateText = new Date(response.data['end_date']);
        endDateText.setHours(endDateText.getHours() + 8);
        endDateText = endDateText.toISOString().split(':');
        endDateText = `${endDateText[0]}:${endDateText[1]}`;

        this.setState({
          fieldStartDate: startDateText,
          fieldEndDate: endDateText,
        });
      } else {
        this.setState({ message: response.message });
      }
    } catch (error) {
      console.log(error);

      this.setState({ message: 'No response from server' });
    }
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

  fetchActivityEditRequest = async () => {
    const {
      activity,
      fieldType,
      fieldStatus,
      fieldOwnerID,
      fieldName,
      fieldDistrict,
      fieldAddress,
      fieldImageSrc,
      fieldImageArray,
      fieldDetail,
      fieldRemark,
      fieldTags,
      updateCoverPhoto,
      updateGalleryPhoto,
      originalFieldImageSrc,
      originalFieldImageArray,
      fieldStartDate,
      fieldEndDate,
    } = this.state;

    const formattedStartDate = new Date(fieldStartDate + ':00+08:00');
    const formattedEndDate = new Date(fieldEndDate + ':00+08:00');

    try {
      let response = await fetch(`${BASE_URL}/admin/activities/edit`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: activity['_id'],
          type: fieldType,
          status: fieldStatus,
          ownerId: fieldOwnerID,
          name: fieldName,
          start_date: formattedStartDate,
          end_date: formattedEndDate,
          district: fieldDistrict,
          address: fieldAddress,

          imageSrc: fieldImageSrc,
          imageArray: fieldImageArray,

          detail: fieldDetail,
          remark: fieldRemark,
          tags: fieldTags,
          photoUploadOptions: {
            cover: updateCoverPhoto,
            detail: updateGalleryPhoto,
          },
          originalImageSrc: originalFieldImageSrc,
          originalImageArray: originalFieldImageArray,
        }),
      });

      response = await response.json();

      if (response.success && response.data) {
        console.log('Activity Edit Success');

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
    this.fetchActivityByParams();
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

  handleActivityEdit = async (event) => {
    event.preventDefault();

    let response;

    try {
      response = await this.UserRoleCheck(localStorage.adminAccessToken);

      if (response) {
        console.log('User Role Verified Success');

        response = await this.fetchActivityEditRequest();
      } else {
        console.log('Activity Edit Failed: User Role Verified Failed');

        this.setState({ message: 'Account is not admin' });
      }
    } catch (error) {
      console.log(error);

      this.setState({ message: 'No response from server' });
    }
  };

  handlePhotoChange = (event) => {
    if (event.target.value === 'false') {
      event.target.name === 'updateCoverPhoto'
        ? this.setState({
            fieldImageSrc: undefined,
            [event.target.name]: false,
          })
        : this.setState({
            fieldImageArray: undefined,
            [event.target.name]: false,
          });
    } else {
      this.setState({ [event.target.name]: true });
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

        alert(response.message);
      }
    } catch (error) {
      console.log(error);
      alert('Upload images Failed. Please try again.');
      return;
    }
  };

  render() {
    const { id } = this.props.match.params;
    const { isFetch, isSuccess } = this.state;
    const loading = <Loading />;
    const {
      message,
      tagsEnabled,
      districts,
      updateCoverPhoto,
      updateGalleryPhoto,
      fieldTags,
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
                {`Edit Activity ${id}`}
              </Typography>
            </header>
          </div>
          <div className='item-edit-body'>
            <Container>
              <form onSubmit={this.handleActivityEdit}>
                <div className='item-field activity-id'>
                  <Row>
                    <Col>
                      <Typography component='h1' variant='h5'>
                        Activity ID :
                      </Typography>
                    </Col>
                    <Col>
                      <Input
                        disabled
                        type='number'
                        min='0'
                        placeholder='Activity ID'
                        label='Activity ID'
                        value={this.state.activity['_id']}
                      />
                    </Col>
                  </Row>
                </div>
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
                        disabled
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
                            {item.text_en}
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
                            if (fieldTags.includes(item['_id'])) {
                              return (
                                <option
                                  selected
                                  key={item._id}
                                  value={item._id}
                                >
                                  {item.text_en}
                                </option>
                              );
                            } else {
                              return (
                                <option key={item._id} value={item._id}>
                                  {item.text_en}
                                </option>
                              );
                            }
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
                <div className='item-field update-cover'>
                  <Row>
                    <Col>
                      <Row>
                        <Col>
                          <Typography component='h1' variant='h5'>
                            Update Cover Image
                          </Typography>
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <p>(Will Replace Original)</p>
                        </Col>
                      </Row>
                    </Col>
                    <Col>
                      <br />
                      <Input
                        type='select'
                        required
                        name='updateCoverPhoto'
                        value={this.state.updateCoverPhoto}
                        onChange={this.handlePhotoChange}
                      >
                        <option value='true'>Yes</option>
                        <option value='false'>No</option>
                      </Input>
                    </Col>
                  </Row>
                </div>
                {updateCoverPhoto && (
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
                )}
                <div className='item-field update-gallery'>
                  <Row>
                    <Col>
                      <Row>
                        <Col>
                          <Typography component='h1' variant='h5'>
                            Update Gallery
                          </Typography>
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <p>(Will Replace Original)</p>
                        </Col>
                      </Row>
                    </Col>
                    <Col>
                      <br />
                      <Input
                        type='select'
                        required
                        name='updateGalleryPhoto'
                        value={this.state.updateGalleryPhoto}
                        onChange={this.handlePhotoChange}
                      >
                        <option value='true'>Yes</option>
                        <option value='false'>No</option>
                      </Input>
                    </Col>
                  </Row>
                </div>
                {updateGalleryPhoto && (
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
                )}
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

export default ActivityItemEdit;
