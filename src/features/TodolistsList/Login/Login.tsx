import React from 'react'
import Grid from '@mui/material/Grid';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useFormik } from 'formik';
import { useAppDispatch, useAppSelector } from '../../../app/store';
import { authUser } from './auth-reducer';
import { Navigate } from 'react-router-dom';

export const Login = () => {

    const dispatch = useAppDispatch()
    const isLoggedIn = useAppSelector(state => state.auth.isLoggedIn)

    const formik = useFormik({
        initialValues: {
          email: '',
          password: '',
          rememberMe: false
        },
        validate: (values) => {
            const errors: any = {}
            if (!values.email) {
                errors.email = 'Required'
            } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
                errors.email = 'Invalid email address'
            }

            if (!values.password) {
                errors.password = 'Required'
            } else if (values.password.length < 3) {
                errors.password = 'Must be more than 3 characters';
            }

            return errors
        },
        onSubmit: values => {
          formik.resetForm()
          dispatch(authUser(values))
        },
        
      });

      if(isLoggedIn) return <Navigate to={'/'}/>

    return <Grid container justifyContent={'center'}>
        <Grid item justifyContent={'center'}>
            <FormControl>
            <form onSubmit={formik.handleSubmit}>
                <FormLabel>
                    <p>To log in get registered
                        <a href={'https://social-network.samuraijs.com/'}
                           target={'_blank'}> here
                        </a>
                    </p>
                    <p>or use common test account credentials:</p>
                    <p>Email: free@samuraijs.com</p>
                    <p>Password: free</p>
                </FormLabel>
                <FormGroup>
                    <TextField label="Email" margin="normal" {...formik.getFieldProps('email')}/*  value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur} *//> 
                    {formik.touched.email && formik.errors.email ? <div>{formik.errors.email}</div> : null}
                    <TextField type="password" label="Password"
                               margin="normal"{...formik.getFieldProps('password')}
                    />
                    {formik.touched.password && formik.errors.password ? <div>{formik.errors.password}</div> : null}
                    <FormControlLabel label={'Remember me'} control={<Checkbox checked={formik.values.rememberMe} {...formik.getFieldProps('rememberMe')}/>}/>
                    <Button type={'submit'} variant={'contained'} color={'primary'}>
                        Login
                    </Button>
                </FormGroup>
                </form>
            </FormControl>
        </Grid>
    </Grid>
}
