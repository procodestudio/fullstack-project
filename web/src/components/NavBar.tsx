import { Box, Button, Flex, Link } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';
import { useLogoutMutation, useMeQuery } from '../graphql/generated/graphql';
import { isServer } from '../utils/isServer';

const NavBar: React.FC = () => {
  let body = null;
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
  const [{ data, fetching }] = useMeQuery({
    pause: isServer(),
  });

  if (fetching) {
    // do nothing
  } else if (!data?.me) {
    body = (
      <>
        <NextLink href="/login">
          <Link mr={2}>Login</Link>
        </NextLink>
        <NextLink href="/register">
          <Link mr={2}>Register</Link>
        </NextLink>
      </>
    )
  } else {
    body = (
      <Flex>
        <Box mr={2}>{data.me.username}</Box>
        <Button 
          isLoading={logoutFetching}
          onClick={() => logout()} variant="link"
        >Logout</Button>
      </Flex>
    )
  }

  return (
    <Flex
      bg="tomato"
      p={4}
      ml="auto"
    >
      <Box ml="auto">{body}</Box>
    </Flex>
  );
}

export default NavBar;