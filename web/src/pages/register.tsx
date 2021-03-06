import { Box, Button } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/dist/client/router';
import React from 'react';
import InputField from '../components/InputField';
import Wrapper from '../components/Wrapper';
import { useRegisterMutation } from '../graphql/generated/graphql';
import { createUrlClient } from '../utils/createUrqlClient';
import { toErrorMap } from '../utils/toErrorMap';

interface registerProps { }

const Register: React.FC<registerProps> = () => {
  const router = useRouter();
  const [, register] = useRegisterMutation();

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

export default withUrqlClient(
  createUrlClient,
)(Register);