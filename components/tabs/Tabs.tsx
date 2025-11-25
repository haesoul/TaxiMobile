import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import SmartImage from '../SmartImage';

export interface ITab {
  id: string | number;
  label: string;
  img?: string;
  disabled?: boolean;
}

interface IProps {
  tabs: ITab[];
  activeTabID: ITab['id'];
  containerClassName?: string;
  onChange: (id: ITab['id']) => any;
  gradient: () => string;
}

const Tabs: React.FC<IProps> = ({
  tabs,
  activeTabID,
  onChange,
  gradient,
}) => {
  return (
    <View style={styles.tabs}>
      {tabs.map((item, index) => {
        const isActive = item.id === activeTabID;
        const isDisabled = item.disabled;

        return (
          <Pressable
            key={index}
            disabled={isDisabled}
            onPress={() => onChange(item.id)}
            style={[
              styles.tab,
              !item.img && styles.small,
              isActive && { backgroundColor: gradient() },
              isDisabled && styles.disabled,
            ]}
          >
            {item.img && (
              <View style={styles.img}>
                <SmartImage
                  source={{ uri: item.img }}
                  resizeMode="contain"
                  style={styles.imgInner}
                />
              </View>
            )}

            <Text style={styles.tabsLabel}>{item.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tabs: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  tab: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },

  small: {
    paddingVertical: 8,
    paddingHorizontal: 10,
  },

  disabled: {
    opacity: 0.4,
  },

  img: {
    width: 26,
    height: 26,
    marginBottom: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },

  imgInner: {
    width: '100%',
    height: '100%',
  },

  tabsLabel: {
    fontSize: 15,
    fontWeight: '500',
  },
});

export default Tabs;
