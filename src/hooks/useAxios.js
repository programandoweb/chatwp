import { useEffect, useState } from 'react';
import axios from 'axios';

const BACKEND = window.location.hostname === 'localhost' ? process.env.REACT_APP_BACKEND : process.env.REACT_APP_BACKENDREMOTE;

const useAxios = () => {
  const [data, setData] = useState(null);
  const [url, setUrl] = useState('');
  const token = localStorage.getItem('user') || null;

  useEffect(() => {
    setUrl(BACKEND + "api/" + process.env.REACT_APP_BACKEND_VERSION);
  }, []);

  const getData = async (requestData, endpoint) => {
    const me = JSON.parse(localStorage.getItem('user'));

    let _url = url;
    if (endpoint) {
      _url = BACKEND + endpoint;
    }

    try {
      const response = await axios.get(_url, {
        headers: {
          Authorization: token ? `Bearer ${me.access_token}` : null,
        },
        params: requestData,
      });

      return response.data
    } catch (err) {
      console.error(err);
    }
  };

  const postData = async (requestData, endpoint, skipMessage = false) => {
    const me = JSON.parse(localStorage.getItem('user'));

    let _url = false;
    if (endpoint) {
      _url = BACKEND + endpoint;
    }

    try {
      const response = await axios.post(_url || url, requestData, {
        headers: {
          Authorization: token ? `Bearer ${me.access_token}` : null,
        },
      });

      if (response && response.data) {
        setData(response.data);
        return response.data;
      }

      return response;
    } catch (err) {
      console.error(err);
    }
  };

  const get = async (endpoint) => {
    try {
      const response = await axios.get(endpoint);
      return response.data
    } catch (err) {
      console.error(err);
    }
  };
  

  return {
    get,
    data,
    postData,
    getData,
  };
};

export default useAxios;
