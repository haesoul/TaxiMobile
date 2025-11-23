import config from '@/config';
import SITE_CONSTANTS from '@/siteConstants';
import store from '@/state';
import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import Passenger from './Passenger';

export default function Index() {
  const [open, setOpen] = useState(false);

  SITE_CONSTANTS.init(store.getState().global.data)
  config.init()
  return (
    <Passenger/>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: 16,
    alignItems: 'center',
  },
});
