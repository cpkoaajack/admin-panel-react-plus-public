import React, { Component } from 'react';
import { Typography, Button, TextField } from '@material-ui/core';
import { Container, Row, Col, Input, Label } from 'reactstrap';
import { Link, Redirect } from 'react-router-dom';
import { BASE_URL } from '../../../constants';
import Loading from '../../Loading';
import ErrorMessage from '../../ErrorMessage';

class ShopCreate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      /* Indicator */
      isFetch: false,
      isSuccess: false,
      message: '',
      /* Data - For shop editing */
      shopTypeEnabled: [],
      tagsEnabled: [],
      ownerID: [],
      districts: [],
      /* Data - Target shop current setting */
      fieldOwnerID: '',
      fieldName: '',
      fieldDistricts: '',
      fieldShopType: '',
      fieldAddress: '',
      fieldPrice: '',
      fieldPhone: '',
      fieldDetail: '',
      fieldRemark: '',
      fieldTags: [],
      fieldImageSrc: '',
      fieldImageArray: [],
      /*
      Data - Business hour object - Start time
      */
      fieldSunStart: '',
      fieldMonStart: '',
      fieldTueStart: '',
      fieldWedStart: '',
      fieldThuStart: '',
      fieldFriStart: '',
      fieldSatStart: '',
      /*
     Data - Business hour object - End time
     */
      fieldSunEnd: '',
      fieldMonEnd: '',
      fieldTueEnd: '',
      fieldWedEnd: '',
      fieldThuEnd: '',
      fieldFriEnd: '',
      fieldSatEnd: '',
      /*
     Data - Business hour object - Rest day
     */
      fieldSun: true,
      fieldMon: true,
      fieldTue: true,
      fieldWed: true,
      fieldThu: true,
      fieldFri: true,
      fieldSat: true,
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

  weekDayArr = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  WeekDayShortLowerArr = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

  stateFieldWeekDayArr = [
    'fieldSun',
    'fieldMon',
    'fieldTue',
    'fieldWed',
    'fieldThu',
    'fieldFri',
    'fieldSat',
  ];

  stateFieldWeekDayStartArr = [
    'fieldSunStart',
    'fieldMonStart',
    'fieldTueStart',
    'fieldWedStart',
    'fieldThuStart',
    'fieldFriStart',
    'fieldSatStart',
  ];

  stateFieldWeekDayEndArr = [
    'fieldSunEnd',
    'fieldMonEnd',
    'fieldTueEnd',
    'fieldWedEnd',
    'fieldThuEnd',
    'fieldFriEnd',
    'fieldSatEnd',
  ];

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
          () => this.fetchShopTypes()
        );
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
            shopTypeEnabled: response.data.map((fullItem) => {
              const subItem = {
                _id: fullItem._id,
                text_en: fullItem.text_en,
                text_zh: fullItem.text_zh,
              };
              return subItem;
            }),
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

  fetchShopCreateRequest = async (businessHourObj) => {
    const {
      fieldOwnerID,
      fieldName,
      fieldShopType,
      fieldImageSrc,
      fieldImageArray,
      fieldDistricts,
      fieldAddress,
      fieldPrice,
      fieldPhone,
      fieldDetail,
      fieldRemark,
      fieldTags,
    } = this.state;

    try {
      let response = await fetch(`${BASE_URL}/admin/shops/create`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ownerId: fieldOwnerID,
          name: fieldName,
          type: fieldShopType,
          imageSrc: fieldImageSrc,
          imageArray: fieldImageArray,
          district: fieldDistricts,
          address: fieldAddress,
          businessHour: businessHourObj,
          price: fieldPrice,
          phone: fieldPhone,
          detail: fieldDetail,
          remark: fieldRemark,
          tags: fieldTags,
        }),
      });

      response = await response.json();

      if (response.success && response.data) {
        console.log('Shop Create Success');

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
    // let fetchShopTags = false;
    // let fetchDistricts = false;
    // let fetchShopTypes = false;
    // this.fetchShopTypeTag().then((result) => (fetchShopTags = result));
    // this.fetchDistricts().then((result) => (fetchDistricts = result));
    // this.fetchShopTypes().then((result) => (fetchShopTypes = result));

    this.fetchShopTypeTag();
  }

  handleInputChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleUpload = (event) => {
    this.handleUploadImage(event.target.name, event.target.files);
  };

  handleToggleChange = (event) => {
    event.target.value === 'true'
      ? this.setState({
          [event.target.name]: true,
          [`${event.target.name}Start`]: '',
          [`${event.target.name}End`]: '',
        })
      : this.setState({ [event.target.name]: false });
  };

  handleInputMultiSelectChange = (event) => {
    const options = event.target.options;
    const value = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        value.push(options[i].value);
      }
    }
    this.setState({ [event.target.name]: value });
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

  handleCreateBusinessHourObj = () => {
    const {
      WeekDayShortLowerArr,
      stateFieldWeekDayArr,
      stateFieldWeekDayStartArr,
      stateFieldWeekDayEndArr,
    } = this;

    let businessHourObj = {};

    stateFieldWeekDayArr.forEach((day, index) => {
      if (!this.state[day]) {
        const startTime = this.state[stateFieldWeekDayStartArr[index]].split(
          ':'
        );
        const endTime = this.state[stateFieldWeekDayEndArr[index]].split(':');
        businessHourObj = {
          ...businessHourObj,
          [WeekDayShortLowerArr[index]]: {
            startHour: new Date(1990, 9, 1, startTime[0], startTime[1], 0, 0),
            endHour: new Date(1990, 9, 1, endTime[0], endTime[1], 0, 0),
            restDay: this.state[day],
          },
        };
      } else {
        businessHourObj = {
          ...businessHourObj,
          [WeekDayShortLowerArr[index]]: { restDay: this.state[day] },
        };
      }
    });

    return businessHourObj;
  };

  handleShopCreate = async (event) => {
    event.preventDefault();

    const businessHourObj = this.handleCreateBusinessHourObj();
    let response;

    try {
      response = await this.UserRoleCheck(localStorage.adminAccessToken);

      if (response) {
        console.log('User Role Verified Success');

        response = await this.fetchShopCreateRequest(businessHourObj);
      } else {
        console.log('Shop Create Failed: User Role Verified Failed');

        this.setState({ message: 'Account is not admin' });
      }
    } catch (error) {
      console.log(error);

      this.setState({ message: 'No response from server' });
    }
  };

  render() {
    const { isFetch, isSuccess } = this.state;
    const loading = <Loading />;
    const { shopTypeEnabled, districts, tagsEnabled, message } = this.state;

    if (isSuccess) return <Redirect to='/dashboard/shops?page=1' />;

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
        <div className='shop-edit'>
          <div className='item-edit-header'>
            <header style={this.style.header}>
              <Typography component='h1' variant='h5'>
                Create Shop
              </Typography>
            </header>
          </div>
          <div className='item-edit-body'>
            <Container>
              <form onSubmit={this.handleShopCreate}>
                <div className='item-field ownerid'>
                  <Row>
                    <Col>
                      <Typography component='h1' variant='h5'>
                        Shop Owner
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
                        value={this.state.fieldOwnerID}
                        onChange={this.handleInputChange}
                      />
                    </Col>
                  </Row>
                </div>
                <div className='item-field phone'>
                  <Row>
                    <Col>
                      <Typography component='h1' variant='h5'>
                        Tel
                      </Typography>
                      <p>(Optional)</p>
                    </Col>
                    <Col>
                      <Input
                        type='tel'
                        name='fieldPhone'
                        placeholder='Phone'
                        pattern='\d{4}[- ]?\d{4}'
                        maxLength='9'
                        label='Phone'
                        value={this.state.fieldPhone}
                        onChange={this.handleInputChange}
                      />
                    </Col>
                  </Row>
                </div>
                <div className='item-field price'>
                  <Row>
                    <Col>
                      <Typography component='h1' variant='h5'>
                        Price
                      </Typography>
                      <p>(Optional)</p>
                    </Col>
                    <Col>
                      <Input
                        type='number'
                        min='0'
                        name='fieldPrice'
                        placeholder='Price'
                        label='Price'
                        value={this.state.fieldPrice}
                        onChange={this.handleInputChange}
                      />
                    </Col>
                  </Row>
                </div>
                <div className='item-field information'>
                  <div className='shop-name'>
                    <Row>
                      <Col>
                        <br />
                        <Typography component='h1' variant='h5'>
                          Information
                        </Typography>
                      </Col>
                      <Col>
                        <TextField
                          variant='outlined'
                          margin='normal'
                          type='text'
                          name='fieldName'
                          placeholder='Shop Name'
                          required
                          label='Shop Name'
                          multiline
                          fullWidth
                          value={this.state.fieldName}
                          onChange={this.handleInputChange}
                        />
                      </Col>
                    </Row>
                  </div>
                  <div className='address'>
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
                  <div className='detail'>
                    <Row>
                      <Col></Col>
                      <Col>
                        <TextField
                          variant='outlined'
                          margin='normal'
                          type='text'
                          name='fieldDetail'
                          placeholder='Detail'
                          label='Detail ( Optional )'
                          multiline
                          fullWidth
                          value={this.state.fieldDetail}
                          onChange={this.handleInputChange}
                        />
                      </Col>
                    </Row>
                  </div>
                  <div className='remark'>
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
                </div>
                <div className='item-field shoptype'>
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
                        name='fieldType'
                        value={this.state.fieldType}
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
                <div className='item-field districts'>
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
                        name='fieldDistricts'
                        value={this.state.fieldDistricts}
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
                <div className='item-field businesshour-list'>
                  <Row>
                    <Col>
                      <Typography component='h1' variant='h5'>
                        Upload Business Hours
                      </Typography>
                    </Col>
                  </Row>
                  {this.stateFieldWeekDayArr.map((day, index) => {
                    return (
                      <div
                        key={day}
                        className='item-field businesshour-list-weekdays'
                      >
                        <Row>
                          <Col>
                            <Typography component='h1' variant='h5'>
                              {this.weekDayArr[index]}
                            </Typography>
                          </Col>
                          <div className='businesshour-list-day'>
                            <div>
                              <Typography component='h1' variant='h5'>
                                Rest?
                              </Typography>
                              <Input
                                type='select'
                                required
                                name={day}
                                value={this.state[day]}
                                onChange={this.handleToggleChange}
                              >
                                <option value='true'>Yes</option>
                                <option value='false'>No</option>
                              </Input>
                            </div>
                            {this.state[day] === false && (
                              <React.Fragment>
                                <div>
                                  <Typography component='h1' variant='h5'>
                                    Open?
                                  </Typography>
                                  <Input
                                    type='time'
                                    required
                                    name={`${day}Start`}
                                    onChange={this.handleInputChange}
                                  ></Input>
                                </div>
                                <div>
                                  <Typography component='h1' variant='h5'>
                                    Close?
                                  </Typography>
                                  <Input
                                    type='time'
                                    required
                                    name={`${day}End`}
                                    onChange={this.handleInputChange}
                                  ></Input>
                                </div>
                              </React.Fragment>
                            )}
                          </div>
                        </Row>
                      </div>
                    );
                  })}
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
                        to='/dashboard/shops?page=1'
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

export default ShopCreate;
