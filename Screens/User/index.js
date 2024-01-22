import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import AppTheme from "../../Utils";
import { useDispatch, useSelector } from "react-redux";
import { userAttendace, userHandler } from "../../Store/Slices/userSlice";
import { useNavigation } from "@react-navigation/core";
import { auth } from "../../Firebase";

const User = () => {
  const [Name, SetName] = useState(null);
  const [Phone, SetPhone] = useState("No");
  const [Email, SetEmail] = useState("No");
  const [Course, SetCourse] = useState("No");
  const [imageUrl, SetimageURL] = useState("No");
  const [Id, SetId] = useState("No");
  const dispatch = useDispatch("")
  const { user } = useSelector((state) => state.userSlice);
  const navigation = useNavigation("")
  const [Loader, setLoader] = useState(false);

  useEffect(()=>{
    SetEmail(user.Email)
    SetName(user.FirstName+ " " + user.LastName)
    SetPhone(user.PhoneNo)
    SetCourse(user.Course)
    SetimageURL(user.image)
    SetId(user.Id)
    
  })

  const logout = ()=>{
    setLoader(true)
        
    auth.signOut()
    .then(() => {
      dispatch(userHandler(null))
      dispatch(userAttendace(null))
      setLoader(true)
      navigation.replace("Login")
  });
}

  return (
    <SafeAreaView style={{ flex: 1 ,opacity : Loader ? 0.5 : 1 }}>
      <StatusBar backgroundColor={AppTheme.BackInnerColor} />
      <View style={{ backgroundColor: AppTheme.BackgroundColor, flex: 1 }}>
        <View style={{ flex: 1, width: "100%", alignItems: "center" }}>
          <View
            style={{
              backgroundColor: AppTheme.BackgroundColor,
              borderBottomEndRadius: 40,
              borderBottomStartRadius: 40,
              flex: 2,
              gap: 10,
              justifyContent: "center",
              alignItems: "center",
              width: "90%",
              backgroundColor: AppTheme.BackInnerColor,
            }}
          >
            <Image
              source={{ uri: imageUrl }}
              style={{
                backgroundColor: "red",
                height: 150,
                width: 150,
                borderRadius: 100,
              }}
            />
            <Text
              style={{
                fontSize: 20,
                color: AppTheme.userNameColor,
                fontWeight: "bold",
              }}
            >
              {Name || "UserNAme"}
            </Text>
          </View>
        </View>

        <View
          style={{ flex: 2, justifyContent: "center", alignItems: "center" }}
        >
          {Loader ? (
        <View style={{position:"absolute" ,top:"50%" ,left:"40%"}}>
          <ActivityIndicator size={70} color={AppTheme.BackInnerColor} />
        </View>
      ) : (
        ""
      )}
          <View style={{ width: "90%", gap: 12 }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "500",
                color: AppTheme.TextColor,
              }}
            >
              Email:
            </Text>
            <TextInput
              style={{
                fontSize: 19,
                paddingLeft: 40,
                borderWidth: 2.5,
                padding: 7,
                borderRadius: 10,
                borderColor: AppTheme.BodersColor,
                color: AppTheme.InputColor,
              }}
              value={Email}
              editable={false}
            />
            <Text
              style={{
                fontSize: 18,
                fontWeight: "500",
                color: AppTheme.TextColor,
              }}
            >
              Course:
            </Text>
            <TextInput
              style={{
                fontSize: 19,
                paddingLeft: 40,
                borderWidth: 2.5,
                padding: 7,
                borderRadius: 10,
                borderColor: AppTheme.BodersColor,
                color: AppTheme.InputColor,
              }}
              value={Course}
              editable={false}
            />
            <Text
              style={{
                fontSize: 18,
                fontWeight: "500",
                color: AppTheme.TextColor,
              }}
            >
              Phone:
            </Text>
            <TextInput
              style={{
                fontSize: 19,
                paddingLeft: 40,
                borderWidth: 2.5,
                padding: 7,
                borderRadius: 10,
                borderColor: AppTheme.BodersColor,
                color: AppTheme.InputColor,
              }}
              value={Phone}
              editable={false}
            />
            <Text
              style={{
                fontSize: 18,
                fontWeight: "500",
                color: AppTheme.TextColor,
              }}
            >
              Id:
            </Text>
            <TextInput
              style={{
                fontSize: 19,
                paddingLeft: 40,
                borderWidth: 2.5,
                padding: 7,
                borderRadius: 10,
                borderColor: AppTheme.BodersColor,
                color: AppTheme.InputColor,
              }}
              value={Id}
              editable={false}
            />
          </View>
        </View>
        <View style={{ flex: 1, alignItems: "center" }}>
          <View
            style={{ position: "absolute", bottom: 20, alignContent: "center" }}
          >
            <TouchableOpacity
              style={{
                backgroundColor: AppTheme.ButtonInnerColor,
                width: 100,
                padding: 8,
                justifyContent: "center",
                borderRadius: 12,
              }}
              onPress={logout}
            >
              <Text
                style={{
                  color: "white",
                  textAlign: "center",
                  fontWeight: "900",
                }}
              >
                Logout
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default User;
