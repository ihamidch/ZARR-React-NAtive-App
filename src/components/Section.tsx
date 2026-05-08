import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

type Props = {
  background?: string;
  children: React.ReactNode;
  style?: ViewStyle;
  paddingBottom?: number;
};

export const Section = ({
  background,
  children,
  style,
  paddingBottom = 24,
}: Props) => {
  return (
    <View
      style={[
        styles.wrapper,
        { backgroundColor: background, paddingBottom },
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
});
