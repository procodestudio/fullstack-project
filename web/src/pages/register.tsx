import React from 'react';
import { Box, Button, background } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import InputField from '../components/InputField';
import Wrapper from '../components/Wrapper';
import { useRegisterMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import { useRouter } from 'next/dist/client/router';

interface registerProps { }

const Register: React.FC<registerProps> = () => {
  const router = useRouter();
  const [_, register] = useRegisterMutation();

  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{
          username: "",
          password: "",
        }}
        onSubmit={async (values, { setErrors }) => {
          const { data } = await register(values);

          if (data?.register.errors) {
            setErrors(toErrorMap(data.register.errors))
          } else if (data?.register.user) {
            router.push('/');
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="username"
              placeholder="username"
              label="username"
            />
            <Box mt={4}>
              <InputField
                name="password"
                placeholder="password"
                label="password"
                type="password"
              />
            </Box>
            <Button
              isLoading={isSubmitting}
              mt={4}
              type="submit"
              colorScheme="blue"
              variant="outline"
            >
              Register
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
}

export default Register;