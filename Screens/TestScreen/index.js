import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";

const TestScreen = () => {
  const [image, setImage] = useState(null);
  const [test, settest] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    })();
  }, []);


  const pickImage = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      // Set the image URI
      setImage(result.uri);
    }
}





  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <TouchableOpacity
        style={{
          backgroundColor: "blue",
          width: 100,
          height: 25,
          justifyContent: "center",
          alignItems: "center",
        }}
        onPress={pickImage}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>Touch Me</Text>
      </TouchableOpacity>
   
    </View>
    
  );
};

export default TestScreen;
