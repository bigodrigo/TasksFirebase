import React, { useContext, useEffect, useState } from "react";
import { Image, Alert } from "react-native";
import { VStack, NativeBaseProvider, Center, Text, Icon, Pressable } from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
//hook e formulários
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
//firebase
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase";
import { addDoc, collection, doc, setDoc, Timestamp } from "firebase/firestore";
//Componentes
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { styles, fonts, colors } from "../../styles";
import { UserProvider, CurrentUserContext } from "../../components/Context/User";
import { User, userConverter } from "../../utils/converter";

const SignUpSchema = yup.object({
  name: yup.string().required("Informe o nome."),
  email: yup.string().required("Informe o e-mail").email("E-mail inválido."),
  password: yup
    .string()
    .required("Informe a senha")
    .min(6, "A senha deve ter pelo menos 6 digitos."),
  password_confirm: yup
    .string()
    .required("Repita a senha")
    .oneOf([yup.ref("password"), null], "A senha não é igual."),
});

export  function SignUp({children}) {
  const [show, setShow] = React.useState(false);
  const { control, handleSubmit, formState: { errors },  } = useForm({
    resolver: yupResolver(SignUpSchema),
  });
  const {setCurrentUser} = useContext(CurrentUserContext);
  //const [criado, setCriado] = useState(false);

  function handleSignUp(data) {
    console.log(data);
    console.log(data.email,data.password);
        if(data.email === '' || data.password === '') {
            Alert.alert('Algo deu errado', 'Preencha todos os campos primeiro!');
            return;
        };
        createUserWithEmailAndPassword(auth, data.email, data.password)
            .then(async(userCredential)  => {
              const user = userCredential.user;
              const uid = user.uid;
              console.log(uid);
              const docRef = doc(db,uid,'Infos').withConverter(userConverter)
              await setDoc(docRef, new User(data.email,data.name,data.password,uid))
            })
            .catch(error => (
            Alert.alert(error.code, error.message)
            ));
            };

  return (
    <NativeBaseProvider>
      <VStack flex={1} px={10}>
        <Center>
          <Image
            source={require("../../assets/icon_no_bg.png")}
            style={styles.imageLogo}
          />
          <Text style={{ color: "white", fontFamily: fonts.bold }} mb={5}>
            Página de Inscrição
          </Text>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange } }) => (
              <Input
                placeholder="Nome"
                onChangeText={onChange}
                errorMessage={errors.name?.message}
                placeholderTextColor={colors.blue_tertiary}
                backgroundColor = {colors.blue_secondary}
                borderColor = {colors.blue_tertiary}
                color = {colors.blue_tertiary}              
              />
            )}
          />
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange } }) => (
              <Input
                placeholder="E-mail"
                onChangeText={onChange}
                errorMessage={errors.email?.message}
                placeholderTextColor={colors.blue_tertiary}
                backgroundColor = {colors.blue_secondary}
                borderColor = {colors.blue_tertiary}
                color = {colors.blue_tertiary} 
              />
            )}
          />
          <Controller
            control={control}
            name="password" 
            render={({ field: { onChange } }) => (
              <Input
                type={show ? "text" : "password"}
                placeholder="Senha"
                onChangeText={onChange}
                errorMessage={errors.password?.message}
                placeholderTextColor={colors.blue_tertiary}
                backgroundColor = {colors.blue_secondary}
                borderColor = {colors.blue_tertiary}
                color = {colors.blue_tertiary} 
                InputRightElement={<Pressable onPress={() => setShow(!show)}>
                <Icon as={<MaterialIcons
                name={show ? "visibility" : "visibility-off"} />} size={5} marginRight={5}
                color={colors.blue_tertiary} // n ficou funcional, voltar aqui
                /></Pressable>}
                />
            )}
          />

          <Controller
            control={control}
            name="password_confirm"
            render={({ field: { onChange } }) => (
              <Input
                placeholder="Confirme a senha"
                type={show ? "text" : "password"}
                onChangeText={onChange}
                errorMessage={errors.password_confirm?.message}
                placeholderTextColor={colors.blue_tertiary}
                backgroundColor = {colors.blue_secondary}
                borderColor = {colors.blue_tertiary}
                color = {colors.blue_tertiary} 
                
              />
            )}
          />
          <Button title="Cadastrar" onPress={handleSubmit(handleSignUp)} backgroundColor = {colors.blue_tertiary} />
        </Center>
      </VStack>
    </NativeBaseProvider>
  );
}
