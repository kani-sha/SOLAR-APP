import { useRouter } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// This is the main entry point of the app, which displays a welcome screen with an image and a button to start the survey
export default function Index() {
  const router = useRouter();

  return (
    <View style={styles.container}>

      // Display the solar icon image at the top of the screen
      <Image
        source={require("../assets/images/solar-icon.png")}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.text}>Solar Made Simple.</Text>

      // Button to navigate to the first survey screen
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/survey1")}
        activeOpacity={0.8}
      >
      // Display the button text
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#5A88C9",
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  text: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  button: {
    position: "absolute",
    bottom: 50,
    backgroundColor: "#fff",
    paddingVertical: 14,
    paddingHorizontal: 60,
    borderRadius: 30,
  },
  buttonText: {
    color: "#f0a500",
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
  },
});

