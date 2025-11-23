import axios from 'axios';

// export const getCacheVersion = (url: string) => axios.get(`${url}/?cv=`)
//   .then(response => response?.data['cache version'])



export const getCacheVersion = async (url: string): Promise<string | undefined> => {
  try {
    const response = await axios.get(`${url}/?cv=`);
    return response.data?.['cache version'];
  } catch (err) {
    console.warn('Failed to fetch cache version', err);
    return undefined;
  }
};