import { Linking, Text } from 'react-native';

export const Attribution = () => (
  <Text style={{ fontSize: 12, color: '#666', textAlign: 'center' }}>
    Map data ©{' '}
    <Text
      style={{ color: 'blue' }}
      onPress={() => Linking.openURL('https://www.openstreetmap.org/')}
    >
      OpenStreetMap
    </Text>{' '}
    contributors
  </Text>
);
