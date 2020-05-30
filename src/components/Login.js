import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { BASE_URL } from '../constants.js';
import { Button, TextField, Typography } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import ErrorMessage from './ErrorMessage';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
      phone: '',
      password: '',
    };
  }

  handleInputChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleCloseErrorMessage = () => {
    this.setState({ message: '' });
  };

  handleLogin = async (event) => {
    event.preventDefault();

    let token;

    try {
      token = await this.UserPasswordCheck();
      if (token) await this.UserRoleCheck(token);
    } catch (error) {
      console.log(error);
    }
  };

  //Return a jwt token for further role checking if the account and password is correct
  UserPasswordCheck = async () => {
    let response;

    try {
      response = await fetch(`${BASE_URL}/user/login`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: this.state.phone,
          password: this.state.password,
        }),
      });

      response = await response.json();

      if (response.success) {
        return response.token;
      } else {
        this.setState({ message: response.message });
        return false;
      }
    } catch (error) {
      console.error(error);

      this.setState({ message: 'No response from server' });
    }
  };

  //Use the given jwt token to check whether the user is 'admin', save to localStorage if success
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
        localStorage.setItem('adminAccessToken', token);
        this.setState({ isLogin: true });
        return true;
      } else {
        this.setState({ message: 'Account is not admin' });
        return false;
      }
    } catch (error) {
      console.error(error);

      this.setState({ message: 'No response from server' });
    }
  };

  render() {
    const { message, phone, password } = this.state;
    const setOpen = message === '' ? false : true;

    if (localStorage.adminAccessToken)
      return (
        <Redirect
          to={{ pathname: '/dashboard', state: { from: this.props.location } }}
        />
      );

    return (
      <div className='local-container'>
        <div className='login'>
          <Paper elevation={3}>
            <div className='login-title'>
              <Typography component='h1' variant='h2'>
                Admin Panel
              </Typography>
            </div>
            <div className='login-form'>
              <form onSubmit={this.handleLogin}>
                <TextField
                  variant='outlined'
                  margin='normal'
                  type='text'
                  name='phone'
                  placeholder='Phone'
                  required
                  fullWidth
                  autoFocus
                  label='Phone'
                  value={phone}
                  onChange={this.handleInputChange}
                />
                <TextField
                  variant='outlined'
                  margin='normal'
                  type='password'
                  name='password'
                  placeholder='Password'
                  required
                  fullWidth
                  label='Password'
                  value={password}
                  onChange={this.handleInputChange}
                />
                <Button type='submit' variant='contained' color='primary'>
                  login
                </Button>
              </form>
            </div>
          </Paper>
        </div>

        {message ? (
          <ErrorMessage
            open={setOpen}
            message={message}
            handleClose={this.handleCloseErrorMessage}
          />
        ) : null}
      </div>
    );
  }
}

export default Login;
