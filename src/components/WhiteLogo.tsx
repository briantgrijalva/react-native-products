import React from 'react';
import { View, Image } from 'react-native';

export const WhiteLogo = () => {
    return (
        <View
            // eslint-disable-next-line react-native/no-inline-styles
            style={{
                alignItems: 'center',
            }}
        >
            <Image
                source={require('../assets/react-logo-white.png')}
                // eslint-disable-next-line react-native/no-inline-styles
                style={{
                    width: 110,
                    height: 100,
                }}
            />
        </View>
    );
};
