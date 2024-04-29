import './App.css';
import{Formik, Form, ErrorMessage, Field} from 'formik' ;
import * as yup from 'yup';
import Axios from 'axios';
import { useState } from 'react';

function App() {

  const [activeTab, setActiveTab] = useState('login');
  const [loginErrorMessage, setLoginErrorMessage] = useState("")
  const [loginSuccessMessage, setLoginSucessMessage] = useState("")
  const [registerErrorMessage, setRegisterErrorMessage] = useState("")
  const [registerSuccessMessage, setRegisterSucessMessage] = useState("")
  const [userName, setUserName] = useState("")

  const tabChange = (tab) =>{
    setActiveTab(tab);
  }

  const handleClickLogin = (values) =>{
    Axios.post("http://localhost:3001/login", {
      email: values.email,
      password: values.password,
    }).then((response) =>{
      console.log(response)
      setLoginSucessMessage(response.data.msg);
      setLoginErrorMessage("")
      setUserName(response.data.name)
    }).catch((error) => {
      setLoginErrorMessage(error.response.data.msg)
      setLoginSucessMessage("")
      setUserName("")
    })
  }
  const handleClickRegister = (values) =>{
    Axios.post("http://localhost:3001/register", {
      name: values.name,
      email: values.email, 
      password: values.password,
    }).then((response) => {
      setRegisterSucessMessage(response.data.msg)
      setRegisterErrorMessage("")
    }).catch((error) =>{
      setRegisterErrorMessage(error.response.data.msg)
      setRegisterSucessMessage("")

    })//enviar 
  }

  //não deixa submeter antes de preenchido certo
  const validationLogin = yup.object().shape({
    email: yup.string().email('Não é um email').required('Este campo é obrigatório'),
    password: yup.string().min(8, 'A senha deve ter 8 caracteres').required('Este campo é obrigatório')
  })

  const validationRegister = yup.object().shape({
    name: yup.string().required('Este campo é obrigatório'),
    email: yup.string().email('Não é um email').required('Este campo é obrigatório'),
    password: yup.string().min(8, 'A senha deve ter 8 caracteres').required('Este campo é obrigatório'),
    confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'As senhas não são iguais')
  })

  return (
    <div className="container">
      <div className='user-name'>
        {userName &&
          <h2>Bem vindo(a) {userName}</h2>
        }
      </div>
      <div className='tabs'>
        <button className={`tab ${activeTab === 'login' ? 'active': ''}`} onClick={() => tabChange('login')}>Login</button>
        <button className={`tab ${activeTab === 'register' ? 'active': ''}`} onClick={() => tabChange('register')}>Cadastre-se</button>
      </div>
      <div className='form-content'>
        {activeTab === 'login' && 
          <div className='tab-content'>
            <h1>Login</h1>
            <Formik 
              initialValues={{}}
              onSubmit={handleClickLogin}
              validationSchema={validationLogin}
            >
              <Form className='login-form'>
                <div className='login-form-group'>
                  <Field name='email' className='form-field' placeholder='Email'/>
                    <ErrorMessage 
                      component='p'
                      name='email'
                      className='form-error'
                    />
                </div>
                <div className='login-form-group'>
                  <Field name='password' type="password" className='form-field' placeholder='Senha'/>
                  <ErrorMessage 
                    component='p'
                    name='password'
                    className='form-error'
                  />
                </div>
                <button className='button' type='submit'>Login</button>
                {loginErrorMessage && 
                  <p className='error-message'>{loginErrorMessage}</p>
                }
                {loginSuccessMessage &&
                  <p className='success-message'>{loginSuccessMessage}</p>
                }
              </Form>
            </Formik>
          </div>
        }
        {activeTab === 'register' &&
          <div className='tab-content'>
            <h1>Cadastre-se</h1>
            <Formik 
              initialValues={{}}
              onSubmit={handleClickRegister}
              validationSchema={validationRegister}
            >
              <Form className='login-form'>
              <div className='login-form-group'>
                  <Field name='name' className='form-field' placeholder='Nome Completo'/>
                    <ErrorMessage 
                      component='p'
                      name='name'
                      className='form-error'
                    />
                </div>
                <div className='login-form-group'>
                  <Field name='email' className='form-field' placeholder='Email'/>
                    <ErrorMessage 
                      component='p'
                      name='email'
                      className='form-error'
                    />
                </div>
                <div className='login-form-group'>
                  <Field name='password' className='form-field' placeholder='Senha'/>
                  <ErrorMessage 
                    component='p'
                    name='password'
                    className='form-error'
                  />
                </div>
                <div className='login-form-group'>
                  <Field name='confirmPassword' className='form-field' placeholder='Confirme sua senha'/>
                  <ErrorMessage 
                    component='p'
                    name='confirmPassword'
                    className='form-error'
                  />
                </div>
                <button className='button' type='submit'>Cadastrar</button>
                {registerErrorMessage && 
                  <p className='error-message'>{registerErrorMessage}</p>
                }
                {registerSuccessMessage &&
                  <p className='success-message'>{registerSuccessMessage}</p>
                }
              </Form>
            </Formik>
          </div>
        }
      </div>
    </div>
  );
}

export default App;
