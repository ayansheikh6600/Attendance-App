import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DashBoard, Login, User } from '../Screens';
import { useDispatch, useSelector } from 'react-redux';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../Firebase';
import { userAttendace } from '../Store/Slices/userSlice';

const NaviContainer = () => {
    const { user ,Attendance} = useSelector((state) => state.userSlice);
    // console.log(user);
    const Stack = createNativeStackNavigator();
    const dispatch = useDispatch("");

    useEffect(()=>{
      // (async () => {
      //   const docRef = doc(db, "users", user.Id);
      //   const docSnap = await getDoc(docRef);
  
      //   if (docSnap.exists()) {
      //     // console.log("Document data:", docSnap.data().Attendance.length);
      //     dispatch(userAttendace(docSnap.data().Attendance));
      //   } else {
      //     // docSnap.data() will be undefined in this case
      //     console.log("No such document!");
      //   }
      // })();
    },[])
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {!user? <Stack.Screen name="Login" component={Login} /> :<><Stack.Screen name="Dashboard" component={DashBoard} />
        <Stack.Screen name="UserProfile" component={User} />
        </>}
         
         
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default NaviContainer