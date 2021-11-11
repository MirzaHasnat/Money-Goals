import React from 'react';
import {Alert} from 'antd';

function Error404() {
  return (
    <Alert type="error" showIcon={true} message="404 Page Not Found" description="You are trying to access the page is never created or moved Permanently." />
  );
}

export default Error404;