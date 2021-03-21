import React from 'react';
import { withUrqlClient } from 'next-urql';
import NavBar from '../components/NavBar';
import { createUrlClient } from '../utils/createUrqlClient';

const Index: React.FC = () => {
  return (
    <>
      <NavBar />
      <div>My App</div>
    </>
  );
}

export default withUrqlClient(
  createUrlClient, { ssr: true },
)(Index);