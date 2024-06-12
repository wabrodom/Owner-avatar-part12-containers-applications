
import { useFormik } from 'formik'
import * as yup from 'yup';

const SingUpContainer = ({ handleSubmit }) => {

  const initialValues = { 
    username: '',
    name: '',
    password: '',
    passwordConfirm: '',
    favoriteGenre: ''
  };


  const validationSchema = yup.object().shape({
    username: yup.string()
      .required('username is required')
      .min(2, 'Too Short!'),
    name: yup.string()
      .required('name is required'),
    password: yup.string()
      .required('password is required'),
    passwordConfirm: yup.string()
      .oneOf([yup.ref('password'), null])
      .required('Password confirmation is required'),
    favoriteGenre: yup.string().required('please add your favorite genre')
  });

  const onSubmit = (values, { resetForm }) => {
    handleSubmit(values)
    resetForm()
  }

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit
  });


  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <div>
          <input
            placeholder="Username"
            onChange={formik.handleChange('username')}
            value={formik.values.username}
          />
            {formik.touched.username && formik.errors.username && (
              <span >{formik.errors.username}</span>
            )}
        </div>

        <div>
          <input
            placeholder="Name"
            onChange={formik.handleChange('name')}
            value={formik.values.name}
          />
            {formik.touched.name && formik.errors.name && (
              <span >{formik.errors.name}</span>
            )}
        </div>

        <div>
          <input
            placeholder="Password"
            onChange={formik.handleChange('password')}
            value={formik.values.password}
            type='password'
          />
            {formik.touched.password && formik.errors.password && (
              <span >{formik.errors.password}</span>
            )}
        </div>

        <div>
          <input
            placeholder="PasswordConfirm"
            onChange={formik.handleChange('passwordConfirm')}
            value={formik.values.passwordConfirm}
            type='passwordConfirm'
          />
            {formik.touched.passwordConfirm && formik.errors.passwordConfirm && (
              <span >{formik.errors.passwordConfirm}</span>
            )}
        </div>
          

        <div>
          <input
            placeholder="favoriteGenre"
            onChange={formik.handleChange('favoriteGenre')}
            value={formik.values.favoriteGenre}
            type='favoriteGenre'
          />
            {formik.touched.favoriteGenre && formik.errors.favoriteGenre && (
              <span >{formik.errors.favoriteGenre}</span>
            )}
        </div>

        <button type="submit">
            Sign up
        </button> 

      </form>

    </div>
  );
};

export default SingUpContainer;



