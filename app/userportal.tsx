import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function UserPortalScreen() {
    const router = useRouter();


    return (
        <View style={styles.container}>
            <Text style={styles.text}>Welcome to Your User Portal</Text>

        
            <TouchableOpacity
                style={styles.button}
                onPress={() => router.push("/userplan")}
                activeOpacity={0.8}
            >
                <Text style={styles.buttonText}>View My Plan</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingRight: 160,
        paddingBottom: 300,
        backgroundColor: '#ffffff',
    },
    text: {
        fontSize: 20,
        marginBottom: 20,
        color: '#000000',
    },
    button: {
        backgroundColor: '#007AFF',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 16,
        textAlign: 'center',
    },
});


