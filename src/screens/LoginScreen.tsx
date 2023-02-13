import React, { useContext, useEffect } from 'react';
import { Background } from '../components/Background';
import { WhiteLogo } from '../components/WhiteLogo';
import { loginStyles } from '../theme/loginTheme';
import { TouchableOpacity, Platform, Text, TextInput, View, KeyboardAvoidingView, Keyboard, Alert } from 'react-native';
import { useForm } from '../hooks/useForm';
import { StackScreenProps } from '@react-navigation/stack';
import { AuthContext } from '../context/AuthContext';

interface Props extends StackScreenProps<any, any> {}

export const LoginScreen = ({ navigation }: Props) => {

    const { signIn, errorMessage, removeError } = useContext(AuthContext);

    const { email, password, onChange } = useForm({
        email: '',
        password: '',
    });

    useEffect(() => {
        if (errorMessage.length === 0) {
            return;
        }
        Alert.alert('Login incorrecto', errorMessage, [{
            text: 'Ok',
            onPress: removeError,
        }]);
    }, [errorMessage, removeError]);

    const onLogin = () => {
        console.log({email, password});
        Keyboard.dismiss();

        signIn({correo: email, password});
    };


  return (
    <>
        <Background />

        <KeyboardAvoidingView
            // eslint-disable-next-line react-native/no-inline-styles
            style={{flex: 1}}
            behavior={(Platform.OS === 'ios') ? 'padding' : 'height'}
        >
            <View style={loginStyles.formContainer}>

                <WhiteLogo />

                <Text style={loginStyles.title}>Login</Text>

                <Text style={loginStyles.label}>Email:</Text>

                <TextInput
                    placeholder="Ingrese su email:"
                    placeholderTextColor="rgba(255,255,255,0.4)"
                    keyboardType="email-address"
                    underlineColorAndroid="white"
                    style={[
                        loginStyles.inputField,
                        (Platform.OS === 'ios') && loginStyles.inputFieldIOS,
                    ]}
                    selectionColor="#DDDFDF"
                    autoCapitalize="none"
                    autoCorrect={false}
                    onChangeText={ (value) => onChange(value, 'email')}
                    value={email}
                    onSubmitEditing={onLogin}
                />

                <Text style={loginStyles.label}>Password:</Text>

                <TextInput
                    placeholder="*********"
                    placeholderTextColor="rgba(255,255,255,0.4)"
                    underlineColorAndroid="white"
                    secureTextEntry
                    style={[
                        loginStyles.inputField,
                        (Platform.OS === 'ios') && loginStyles.inputFieldIOS,
                    ]}
                    selectionColor="#DDDFDF"
                    autoCapitalize="none"
                    autoCorrect={false}
                    onChangeText={ (value) => onChange(value, 'password')}
                    value={password}
                    onSubmitEditing={onLogin}
                />
                <View style={loginStyles.bottomContainer}>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={loginStyles.button}
                        onPress={onLogin}
                    >
                        <Text style={loginStyles.buttonText}>Login</Text>
                    </TouchableOpacity>
                </View>

                <View style={loginStyles.newUserContainer}>
                <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={ () => navigation.replace('RegisterScreen')}
                        // style={loginStyles.button}
                    >
                        <Text style={loginStyles.buttonText}>Nueva Cuenta </Text>
                    </TouchableOpacity>
                </View>

            </View>
        </KeyboardAvoidingView>
    </>
  );
};
