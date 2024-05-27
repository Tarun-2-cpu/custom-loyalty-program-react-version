import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Divider, FormHelperText, Grid, InputAdornment, IconButton, InputLabel, OutlinedInput, Stack, Typography } from '@mui/material';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { Formik } from 'formik';
import AnimateButton from 'components/@extended/AnimateButton';
import EyeOutlined from '@ant-design/icons/EyeOutlined';
import EyeInvisibleOutlined from '@ant-design/icons/EyeInvisibleOutlined';

export default function AuthLogin({ isDemo = false }) {
  const [showPassword, setShowPassword] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [loginFailed, setLoginFailed] = useState(false);
  const navigate = useNavigate();

  
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const apiUrl = "https://cl-backend.kryptocoder.com/api/";

  const updateMember = async (formAccountNum, formCardId) => {
    const inputData = JSON.stringify({
      "accountnumber": formAccountNum,
      "cardid": formCardId
    });

    try {
      const response = await fetch(apiUrl + 'memberData', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: inputData
      });

      const data = await response.json();
      if (data.error) {
        console.error(data.error);
        setLoginFailed(true);
        setLoginSuccess(false);
      } else {
        localStorage.setItem('accountNumber', JSON.stringify(formAccountNum));
        localStorage.setItem('cardId', JSON.stringify(formCardId));
        sessionStorage.setItem('memberData', JSON.stringify(data));
        setLoginSuccess(true); 
        setLoginFailed(false);
        navigate('/member-dashboard')
      }
    } catch (error) {
      console.error('Error:', error);
      setLoginFailed(true);
      setLoginSuccess(false);
    }
  };

  return (
    <Formik
      initialValues={{
        accountNumber: '',
        accessId: '',
        submit: null
      }}
      validationSchema={Yup.object().shape({
        accountNumber: Yup.string().max(255).required('Account Number is required'),
        accessId: Yup.string().max(255).required('Access ID is required')
      })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        try {
          await updateMember(values.accountNumber, values.accessId);
          setStatus({ success: true });
          setSubmitting(false);
        } catch (err) {
          console.error(err);
          setStatus({ success: false });
          setErrors({ submit: err.message });
          setSubmitting(false);
        }
      }}
    >
      {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
        <form noValidate onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Stack spacing={1}>
                <InputLabel htmlFor="account-number-login">Account Number</InputLabel>
                <OutlinedInput
                  id="account-number-login"
                  type="text"
                  value={values.accountNumber}
                  name="accountNumber"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="Enter Account Number"
                  fullWidth
                  error={Boolean(touched.accountNumber && errors.accountNumber)}
                  className="form-control account-number"
                />
                {touched.accountNumber && errors.accountNumber && (
                  <FormHelperText error id="standard-weight-helper-text-account-number-login">
                    {errors.accountNumber}
                  </FormHelperText>
                )}
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <Stack spacing={1}>
                <InputLabel htmlFor="access-id-login">Access ID</InputLabel>
                <OutlinedInput
                  fullWidth
                  error={Boolean(touched.accessId && errors.accessId)}
                  id="access-id-login"
                  type={showPassword ? 'text' : 'password'}
                  value={values.accessId}
                  name="accessId"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle access id visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                        color="secondary"
                      >
                        {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                      </IconButton>
                    </InputAdornment>
                  }
                  placeholder="Enter Access ID"
                  className="form-control card-id"
                />
                {touched.accessId && errors.accessId && (
                  <FormHelperText error id="standard-weight-helper-text-access-id-login">
                    {errors.accessId}
                  </FormHelperText>
                )}
              </Stack>
            </Grid>

            <Grid item xs={12} sx={{ mt: -1 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
              </Stack>
            </Grid>
            {errors.submit && (
              <Grid item xs={12}>
                <FormHelperText error>{errors.submit}</FormHelperText>
              </Grid>
            )}
            <Grid item xs={12}>
              <AnimateButton>
                <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="primary" className="btn btn-primary btn-lg btn-shadow sign-in-member">
                  SIGN IN
                </Button>
              </AnimateButton>
            </Grid>
            <Grid item xs={12}>
              <Divider>
                <Typography variant="caption"> Sign in with</Typography>
              </Divider>
            </Grid>
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button variant="outlined" color="primary">
                Partner
              </Button>
            </Grid>
          </Grid>
          {loginSuccess && (
            <Typography variant="h6" color="success.main" sx={{ mt: 2 }}>
              Successfully logged in!
            </Typography>
          )}
          {loginFailed && (
            <Typography variant="h6" color="error" sx={{ mt: 2 }}>
              Login Failed. Check your credentials.
            </Typography>
          )}
        </form>
      )}
    </Formik>
  );
}

AuthLogin.propTypes = { isDemo: PropTypes.bool };
