import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BackButton from './common/BackButton';
import { addNewUser } from '../httpRequests/auth';
import Input from './common/Input';
import { useDispatch } from 'react-redux';
import { setError, setErrorPopupOpen } from '../store/project/project.actions';

const defaultRegistrationFormValues = {
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirm_password: ""
}

const Register = () => {
    const [formValues, setFormValues] = useState(defaultRegistrationFormValues);
    const {first_name, last_name, email, password, confirm_password} = formValues;
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (formValues.confirm_password !== formValues.password) {
            dispatch(setError("Passwords don't match"));
            dispatch(setErrorPopupOpen(true));
            return;
        }
        try {
            await addNewUser(formValues);
            resetFormValues();
            navigate('/login');
        } catch ({response}) {
            if (response.data.error && response.status === 400) {
                dispatch(setError(response.data.error));
                dispatch(setErrorPopupOpen(true));
            }
        }
    }

    const resetFormValues = () => setFormValues(defaultRegistrationFormValues);
    
    const handleInputChange = (e) => {
       return setFormValues({...formValues, [e.target.name]: e.target.value ? e.target.value: formValues[e.target.name].value});
    }

  return (
    <>
    <BackButton/>
    <div className='form-container'>
        <form onSubmit={handleFormSubmit}>
            <h2>Create an account</h2>

            <div className='form-inputs-container'>
                <Input
                    name='first_name'
                    id='first_name'
                    onChange={handleInputChange}
                    value={first_name}
                    type='text'
                    text='First name'
                />

                <Input
                    id='last_name'
                    name='last_name'
                    type="text"
                    onChange={handleInputChange}
                    value={last_name}
                    text="Last name"
                />
                               
                <Input
                    id='email'
                    name='email'
                    type="email"
                    onChange={handleInputChange}
                    value={email}
                    text="Email"
                />
            
                <Input
                    id='password'
                    name='password'
                    type="password"
                    onChange={handleInputChange}
                    value={password}
                    text="Password"
                />
            
                <Input
                    id='confirm_password'
                    name='confirm_password'
                    type="password"
                    onChange={handleInputChange}
                    value={confirm_password}
                    text="Confirm password"
                />
                
                <button type='submit' className='btn'>Create my account</button>
            </div>
            <p>Already registered? <Link to="/login" className='link blue'>Log in</Link></p>
        </form>
    </div>
    </>
  )
}

export default Register;