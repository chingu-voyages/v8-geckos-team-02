import React from 'react';
import Header from '../components/utils/Header';
import Map from '../components/utils/Map';

import withRoot from '../withRoot';

const App = () => {
  return (
    <>
      <Header />
      <Map />
    </>
  );
};

export default withRoot(App);
