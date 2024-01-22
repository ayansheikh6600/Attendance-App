import { createSlice } from "@reduxjs/toolkit";




const initialState = {
    user : null,
    Attendance : null,
    Loader : false
   };
 
   const userSlice = createSlice({
     name: "user",
     initialState,
     reducers:{
         userHandler :( state, action) => {
             state.user = action.payload
             console.log("aaaaaction",action.payload)
         },
         userAttendace :( state, action) => {
             state.Attendance = action.payload
            //  console.log("aaaaaction",action.payload)
         },
         SetLoader :( state, action) => {
             state.Loader = action.payload
            //  console.log("aaaaaction",action.payload)
         }
     }
   })
 
   const { actions } = userSlice;
 export const { userHandler, userAttendace } = actions;
 
 export default userSlice.reducer;