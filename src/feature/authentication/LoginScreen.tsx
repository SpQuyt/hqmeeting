import { yupResolver } from '@hookform/resolvers/yup';
import { firebase } from '@react-native-firebase/auth';
import { Themes } from 'assets/themes';
import { StyledButton, StyledInputForm } from 'components/base';
import StyledOverlayLoading from 'components/base/StyledOverlayLoading';
import React, { FunctionComponent, useRef, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import yupValidate from 'utilities/yupValidate';
import * as yup from 'yup';

// const DEFAULT_FORM: any = {
//     email: 'spquyt@gmail.com',
//     password: '20022022',
// };

const DEFAULT_FORM: any = {
    email: '',
    password: '',
};

const LoginScreen: FunctionComponent = () => {
    const passwordRef = useRef<any>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (option: any) => {
        try {
            const { email, password } = option;
            setIsLoading(true);
            await firebase.auth().signInWithEmailAndPassword(email, password);
        } catch (err) {
            alert(err);
        } finally {
            setIsLoading(false);
        }
    };

    const yupSchema = yup.object().shape({
        email: yupValidate.email(),
        password: yupValidate.password(),
    });
    const form = useForm({
        mode: 'onChange', // validate form onChange
        defaultValues: DEFAULT_FORM,
        resolver: yupResolver(yupSchema),
        reValidateMode: 'onChange',
        criteriaMode: 'firstError', // first error from each field will be gathered.
    });
    const {
        formState: { isValid },
        handleSubmit,
    } = form;

    return (
        <KeyboardAwareScrollView
            contentContainerStyle={styles.container}
            keyboardShouldPersistTaps="handled"
            enableOnAndroid={true}
            showsVerticalScrollIndicator={false}
            enableResetScrollToCoords={false}
        >
            <StyledOverlayLoading visible={isLoading} />
            <View style={styles.body}>
                <FormProvider {...form}>
                    <StyledInputForm
                        name="email"
                        customPlaceHolder="authen.login.placeholderEmail"
                        keyboardType="email-address"
                        maxLength={32}
                        onSubmitEditing={() => passwordRef.current.focus()}
                    />
                    <StyledInputForm
                        name="password"
                        customPlaceHolder="authen.login.placeholderPassword"
                        ref={passwordRef}
                        secureTextEntry
                        returnKeyType="done"
                        maxLength={20}
                    />
                </FormProvider>

                <StyledButton
                    onPress={handleSubmit(handleLogin)}
                    title="authen.login.buttonLogin"
                    disabled={!isValid}
                    customStyle={[
                        styles.loginButton,
                        { backgroundColor: isValid ? `rgba(252, 177, 3, 1)` : `rgba(252, 177, 3, 0.5)` },
                    ]}
                />
            </View>
        </KeyboardAwareScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    body: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loginButton: {
        marginTop: 20,
        borderWidth: 0,
    },
    registerButton: {
        marginTop: 20,
    },
    errorMessage: {
        color: Themes.COLORS.borderInputError,
    },
});

export default LoginScreen;
