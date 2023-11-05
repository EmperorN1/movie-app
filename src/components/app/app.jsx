import React from 'react';
import './app.css';
import { Alert, Space } from 'antd';
import { Offline, Online } from 'react-detect-offline';

import AppPage from '../app-page/app-page';

const App = () => {
  return (
    <React.Fragment>
      <Online>
        <AppPage />
      </Online>
      <Offline>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Alert
            message="It looks like you reached the end of internet"
            description="It mignt be something good but unfortunately you connot watch content on our site."
            type="error"
          />
        </Space>
      </Offline>
    </React.Fragment>
  );
};

export default App;
