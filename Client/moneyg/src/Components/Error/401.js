import React from 'react';
import {Alert} from 'antd';

function Error401() {
  return (
    <Alert type="warning" showIcon={true} message="401 UnAuthorize Access" description="You Are Not Athorize To Access This Page Please Login." />
  );
}

export default Error401;