import {
  View,
  Text,
  Image,
  StatusBar,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import AppTheme from "../../Utils";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/core";
import { Camera } from "expo-camera";
import * as Location from "expo-location";
import * as ImagePicker from "expo-image-picker";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import {
  db,
  getDownloadURL,
  ref,
  storage,
  uploadBytesResumable,
} from "../../Firebase";
import { userAttendace } from "../../Store/Slices/userSlice";

const DashBoard = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [Name, SetName] = useState(null);
  const [Course, SetCourse] = useState("No");
  const [Id, SetId] = useState("No");
  const [image, setImage] = useState(null);
  const [Loader, setLoader] = useState(false);


  // const [attendace, setAttendance] = useState(null);
  const { user, Attendance} = useSelector((state) => state.userSlice);
  const navigation = useNavigation("");
  const dispatch = useDispatch("");

  useEffect(() => {
    (async () => {
      SetCourse(user.Course);
      SetName(user.FirstName + " " + user.LastName);
      setImage(user.image);
      SetId(user.Id);

      (async () => {
        const docRef = doc(db, "users", user.Id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          dispatch(userAttendace(docSnap.data().Attendance));
        } else {
          console.log("No such document!");
        }
      })();

      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();

    (async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    })();
  }, []);

  const pickImage = async () => {
    setLoader(true)

    let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    var DONE;
    if (!result.canceled) {
      DONE = result.assets[0].uri;
    }

    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function () {
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", DONE, true);
      xhr.send(null);
    });

    const metadata = {
      contentType: "image/jpeg",
    };

    const storageRef = ref(storage, "users/" + Date.now());
    const uploadTask = uploadBytesResumable(storageRef, blob, metadata);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
       
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
          case "storage/unauthorized":
            break;
          case "storage/canceled":
            break;
          case "storage/unknown":
            break;
        }
      },
      () => {
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          console.log("File available at", downloadURL);
          const obj = {
            CheckInTime: Date.now(),
            CheckOutTime: false,
            image: downloadURL,
            ExpireCheckInTime: Date.now() + 86400000,
            ExpireCheckOutTime: false,
            location : location,
          };

          const docRef = doc(db, "users", user.Id);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            console.log("Document data:", docSnap.data());
            const data = docSnap.data();
            data.Attendance.push(obj);

            dispatch(userAttendace(data.Attendance));

            await updateDoc(docRef, data);
            // console.log("aaaaaaaa",data )
            setLoader(false)
          } else {
            // docSnap.data() will be undefined in this case
            console.log("No such document!");
            setLoader(false)
          }
        });
      }
    );
  };

  const CheckOutFun = async () => {
    setLoader(true)
    const docRef = doc(db, "users", user.Id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      const data = docSnap.data();

      data.Attendance[Attendance.length - 1].CheckOutTime = Date.now();
      data.Attendance[Attendance.length - 1].ExpireCheckOutTime =
        Date.now() + 86400000;

      dispatch(userAttendace(data.Attendance));
      
      await updateDoc(docRef, data);
      setLoader(false)
    } else {
      setLoader(false)
      console.log("No such document!");
    }
  };
  // foo()
  const condition = Attendance && Attendance[Attendance.length - 1];
  console.log(condition);
  const currentTime = Date.now();
  const ExpireCheckInTime = condition && condition.ExpireCheckInTime;
  if (ExpireCheckInTime && ExpireCheckInTime <= currentTime) {
    return (
      <SafeAreaView style={[styles.container, {opacity : Loader?0.5:1}]}>
        {Loader ? (
        <View style={{position:"absolute" ,top:"50%" ,left:"40%"}}>
          <ActivityIndicator size={70} color={AppTheme.BackInnerColor} />
        </View>
      ) : (
        ""
      )}
        <StatusBar backgroundColor={styles.statusBar.backgroundColor} />
        <View style={styles.profileContainer}>
        
          <View style={styles.profileInnerContainer}>
            <View style={styles.profileInfoContainer}>
              <Text style={styles.userNameText}>{Name}</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("UserProfile")}
              >
                <Image
                  style={styles.userImage}
                  source={{ uri: image }}
                  width={60}
                  height={60}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={styles.mainContentContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.labelText}>Id:</Text>
            <TextInput style={styles.textInput} value={Id} editable={false} />
            <Text style={styles.labelText}>Course:</Text>
            <TextInput
              style={styles.textInput}
              value={Course}
              editable={false}
            />
            <Text style={styles.labelText}>Check In Time:</Text>
            <TextInput
              style={styles.textInput}
              value={
                Attendance && Attendance[Attendance.length - 1] &&
                new Date(
                  Attendance[Attendance.length - 1].CheckInTime
                ).toString()
              }
              editable={false}
            />
            <Text style={styles.labelText}>Check Out Time:</Text>
            <TextInput
              style={styles.textInput}
              value={
                Attendance && Attendance[Attendance.length - 1] &&
                new Date(
                  Attendance[Attendance.length - 1].CheckOutTime
                ).toString()
              }
              editable={false}
            />
          </View>
        </View>
        <View style={styles.actionButtonContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={pickImage}>
            <Text style={styles.actionButtonText}>Check In</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container,{opacity : Loader?0.5:1}]}>
      {Loader ? (
        <View style={{position:"absolute" ,top:"50%" ,left:"40%"}}>
          <ActivityIndicator size={70} color={AppTheme.BackInnerColor} />
        </View>
      ) : (
        ""
      )}
      <StatusBar backgroundColor={AppTheme.BackInnerColor} />
      <View style={styles.profileContainer}>
    
        <View style={styles.profileInnerContainer}>
          <View style={styles.profileInfoContainer}>
            <Text style={styles.userNameText}>{Name}</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("UserProfile")}
            >
              <Image
                style={styles.userImage}
                source={{ uri: image }}
                width={60}
                height={60}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={styles.mainContentContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.labelText}>Id:</Text>
          <TextInput style={styles.textInput} value={Id} editable={false} />
          <Text style={styles.labelText}>Course:</Text>
          <TextInput style={styles.textInput} value={Course} editable={false} />
          <Text style={styles.labelText}>Check In Time:</Text>
          <TextInput
            style={styles.textInput}
            value={
              Attendance && Attendance[Attendance.length - 1] &&
              new Date(Attendance[Attendance.length - 1].CheckInTime).toString()
            }
            editable={false}
          />
          <Text style={styles.labelText}>Check Out Time:</Text>
          <TextInput
            style={styles.textInput}
            value={
              Attendance && Attendance[Attendance.length - 1] &&
              new Date(
                Attendance[Attendance.length - 1].CheckOutTime
              ).toString()
            }
            editable={false}
          />
        </View>
        {console.log(location)}
      </View>
      <View style={styles.actionButtonContainer}>
        {Attendance && Attendance.length === 0 ? (
          <TouchableOpacity style={styles.actionButton} onPress={pickImage}>
            <Text style={styles.actionButtonText}>Check In</Text>
          </TouchableOpacity>
        ) : Attendance && !Attendance[Attendance.length - 1].CheckOutTime ? (
          <TouchableOpacity style={styles.actionButton} onPress={CheckOutFun}>
            <Text style={styles.actionButtonText}>Check Out</Text>
          </TouchableOpacity>
        ) : (
          ""
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: AppTheme.BackgroundColor,
    width: "100%",
    
  },
  statusBar: {
    backgroundColor: AppTheme.BackInnerColor,
  },
  profileContainer: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  profileInnerContainer: {
    flex: 1,
    width: "90%",
    backgroundColor: AppTheme.BackInnerColor,
    borderBottomRightRadius: 25,
    borderBottomLeftRadius: 25,
  },
  profileInfoContainer: {
    flex: 1,
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    alignItems: "center",
  },
  userNameText: {
    color: AppTheme.userNameColor,
    fontSize: 20,
    fontWeight: "bold",
  },
  userImage: {
    width: 60,
    height: 60,
    borderRadius: 100,
    backgroundColor: "red",
  },
  mainContentContainer: {
    flex: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  inputContainer: {
    width: "90%",
    gap: 12,
  },
  labelText: {
    fontSize: 18,
    fontWeight: "500",
    color: AppTheme.TextColor,
  },
  textInput: {
    fontSize: 19,
    paddingLeft: 40,
    borderWidth: 2.5,
    padding: 7,
    borderRadius: 10,
    borderColor: AppTheme.BodersColor,
    color: AppTheme.InputColor,
  },
  actionButtonContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  actionButton: {
    backgroundColor: AppTheme.ButtonInnerColor,
    width: 100,
    padding: 8,
    justifyContent: "center",
    borderRadius: 12,
  },
  actionButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "900",
  },
};

export default DashBoard;
