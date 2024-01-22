import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/core";
import AppTheme from "../../Utils";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../Firebase";
import { userHandler } from "../../Store/Slices/userSlice";
import { ActivityIndicator } from "react-native";

const Login = () => {
  const [Email, SetEmail] = useState("");
  const [Password, SetPassword] = useState("");
  const [Loader, SetLoader] = useState(false);
  const navigation = useNavigation();

  const { user } = useSelector((state) => state.userSlice);
  const dispatch = useDispatch("");

  const SigningHAndler = () => {
    SetLoader(true)
    // dispatch(userHandler(null))
    console.log();

    if (!Email || !Password) {
      SetLoader(false)
      return;
      
    }

    // return

    const auth = getAuth();
    signInWithEmailAndPassword(auth, Email, Password)
      .then(async (userCredential) => {
        // Signed in
        const user = userCredential.user;
        // ...
        console.log(user);

        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          console.log("Document data:", docSnap.data());
          const userdata = docSnap.data();
          console.log(userdata);
          // return
          dispatch(userHandler(userdata));
          navigation.navigate("Dashboard");
        } else {
          SetLoader(false)
          // docSnap.data() will be undefined in this case
          console.log("No such document!");
        }
      })
      .catch((error) => {
        SetLoader(false)
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  };

  return (<>
  {Loader ? (
        <View style={{position:"absolute" ,top:"50%", width:"100%" ,opacity:1}}>
          <ActivityIndicator size={70} style={{opacity:10}} color={AppTheme.BackInnerColor} />
        </View>
      ) : (
        ""
      )}
  <View style={[styles.container,{opacity:Loader?0.5:1}]}>
      <View style={styles.logoContainer}>
        <View style={styles.logoContent}>
          <Image
            style={styles.logoImage}
            source={require("../../assets/logo.png")}
          />
          <Text style={styles.appName}>{AppTheme.AppName}</Text>
        </View>
      </View>
      <View style={styles.formContainer}>
        <View style={styles.formHeader}></View>
        <View style={styles.formInputs}>
          <TextInput
            placeholder="Email"
            style={styles.input}
            value={Email}
            onChangeText={(e) => SetEmail(e)}
          />
          <View>
            <TextInput
              placeholder="Password"
              secureTextEntry={true}
              style={styles.input}
              value={Password}
              onChangeText={(e) => SetPassword(e)}
            />
            <Text style={styles.forgetPasswordText}>Forget Password?</Text>
          </View>
          <View>
            <TouchableOpacity
              style={styles.loginButton}
              onPress={SigningHAndler}
            >
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  </>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppTheme.BackgroundColor,
    alignItems: "center",
    
  },
  logoContainer: {
    flex: 1,
    width: "100%",
    alignItems: "center",
  },
  logoContent: {
    flex: 1,
    justifyContent: "flex-end",
    width: "90%",
    alignItems: "center",
    backgroundColor: AppTheme.BackInnerColor,
  },
  logoImage: {},
  appName: {
    fontSize: 20,
    fontWeight: "bold",
    color: AppTheme.logoHeadingColor,
  },
  formContainer: {
    flex: 2,
    width: "100%",
    alignItems: "center",
  },
  formHeader: {
    flex: 1,
    width: "90%",
    alignItems: "center",
    backgroundColor: AppTheme.BackInnerColor,
    borderBottomEndRadius: 25,
    borderBottomStartRadius: 25,
  },
  formInputs: {
    flex: 8,
    width: "90%",
    gap: 10,
    paddingTop: 12,
  },
  input: {
    paddingLeft: 10,
    borderWidth: 2,
    padding: 8,
    borderRadius: 10,
    fontSize: 17,
    borderColor: AppTheme.BodersColor,
  },
  forgetPasswordText: {
    fontWeight: "bold",
    marginTop: 3,
    color: AppTheme.FontColor,
  },
  loginButton: {
    padding: 10,
    borderRadius: 100,
    backgroundColor: AppTheme.ButtonInnerColor,
  },
  loginButtonText: {
    color: AppTheme.ButtonTextColor,
    textAlign: "center",
    fontWeight: "bold",
  },
  noAccountText: {
    fontWeight: "bold",
    marginTop: 3,
    color: AppTheme.FontColor,
  },
});

export default Login;
