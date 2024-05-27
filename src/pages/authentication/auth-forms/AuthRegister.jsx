import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// material-ui
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project import
import AnimateButton from 'components/@extended/AnimateButton';

// Email validation function
const validateEmail = (email) => {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
};

export default function AuthRegister() {
  const navigate = useNavigate();

  return (
    <Formik
      initialValues={{
        firstname: '',
        lastname: '',
        accountnumber: '',
        cardid: '',
        email: '',
        phonenumber: '',
        submit: null
      }}
      validationSchema={Yup.object().shape({
        firstname: Yup.string().max(255).required('First Name is required'),
        lastname: Yup.string().max(255).required('Last Name is required'),
        accountnumber: Yup.string().min(6, 'Account number must be a minimum of 6 digits').matches(/^\d+$/, 'Account number can only contain numbers').required('Account Number is required'),
        cardid: Yup.string().min(6, 'Card ID must be a minimum of 6 digits').matches(/^\d+$/, 'Card ID can only contain numbers').required('Access Card ID is required'),
        email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
        phonenumber: Yup.string().matches(/^\d+$/, 'Phone number can only contain numbers').required('Phone Number is required')
      })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        try {
          // Create JSON data
          const inputData = JSON.stringify({
            "firstname": values.firstname,
            "lastname": values.lastname,
            "email": values.email,
            "phonenumber": values.phonenumber,
            "accountnumber": values.accountnumber,
            "cardid": values.cardid
          });

          // Define settings object for axios request
          const response = await axios.post('https://cl-backend.kryptocoder.com/api/registerMember', inputData, {
            headers: {
              'Content-Type': 'application/json'
            }
          });

          // Handle successful response
          if (response.data.success) {
            alert('Successfully registered!');
            navigate('/index.html');
          } else {
            alert(response.data.message);
          }

          setStatus({ success: true });
          setSubmitting(false);
        } catch (err) {
          setStatus({ success: false });
          setErrors({ submit: err.message });
          setSubmitting(false);
        }
      }}
    >
      {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
        <form noValidate onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Stack spacing={1}>
                <InputLabel htmlFor="firstname-signup">First Name*</InputLabel>
                <OutlinedInput
                  id="firstname-signup"
                  type="text"
                  value={values.firstname}
                  name="firstname"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="John"
                  fullWidth
                  error={Boolean(touched.firstname && errors.firstname)}
                />
                {touched.firstname && errors.firstname && (
                  <FormHelperText error id="helper-text-firstname-signup">
                    {errors.firstname}
                  </FormHelperText>
                )}
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Stack spacing={1}>
                <InputLabel htmlFor="lastname-signup">Last Name*</InputLabel>
                <OutlinedInput
                  id="lastname-signup"
                  type="text"
                  value={values.lastname}
                  name="lastname"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="Doe"
                  fullWidth
                  error={Boolean(touched.lastname && errors.lastname)}
                />
                {touched.lastname && errors.lastname && (
                  <FormHelperText error id="helper-text-lastname-signup">
                    {errors.lastname}
                  </FormHelperText>
                )}
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <Stack spacing={1}>
                <InputLabel htmlFor="accountnumber-signup">Account Number*</InputLabel>
                <OutlinedInput
                  id="accountnumber-signup"
                  type="text"
                  value={values.accountnumber}
                  name="accountnumber"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  fullWidth
                  error={Boolean(touched.accountnumber && errors.accountnumber)}
                />
                {touched.accountnumber && errors.accountnumber && (
                  <FormHelperText error id="helper-text-accountnumber-signup">
                    {errors.accountnumber}
                  </FormHelperText>
                )}
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <Stack spacing={1}>
                <InputLabel htmlFor="cardid-signup">Access Card ID*</InputLabel>
                <OutlinedInput
                  id="cardid-signup"
                  type="text"
                  value={values.cardid}
                  name="cardid"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  fullWidth
                  error={Boolean(touched.cardid && errors.cardid)}
                />
                {touched.cardid && errors.cardid && (
                  <FormHelperText error id="helper-text-cardid-signup">
                    {errors.cardid}
                  </FormHelperText>
                )}
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <Stack spacing={1}>
                <InputLabel htmlFor="email-signup">Email Address*</InputLabel>
                <OutlinedInput
                  id="email-signup"
                  type="email"
                  value={values.email}
                  name="email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  fullWidth
                  error={Boolean(touched.email && errors.email)}
                />
                {touched.email && errors.email && (
                  <FormHelperText error id="helper-text-email-signup">
                    {errors.email}
                  </FormHelperText>
                )}
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <Stack spacing={1}>
                <InputLabel htmlFor="phonenumber-signup">Phone Number*</InputLabel>
                <OutlinedInput
                  id="phonenumber-signup"
                  type="text"
                  value={values.phonenumber}
                  name="phonenumber"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  fullWidth
                  error={Boolean(touched.phonenumber && errors.phonenumber)}
                />
                {touched.phonenumber && errors.phonenumber && (
                  <FormHelperText error id="helper-text-phonenumber-signup">
                    {errors.phonenumber}
                  </FormHelperText>
                )}
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <AnimateButton>
                <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="primary">
                  Register
                </Button>
              </AnimateButton>
            </Grid>
          </Grid>
        </form>
      )}
    </Formik>
  );
}
