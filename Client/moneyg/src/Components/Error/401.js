import React from 'react';
import {Alert} from 'antd';
import {Navigate} from 'react-router-dom';

function Error401() {
  return (
    <>
      <Alert type="warning" showIcon={true} message="401 UnAuthorize Access" description="You Are Not Athorize To Access This Page Please Login." />
      <Navigate to="/login" />
    </>
  );
}

export default Error401;