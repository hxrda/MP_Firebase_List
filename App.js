import { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import {
	StyleSheet,
	Text,
	View,
	TextInput,
	Button,
	FlatList,
} from "react-native";
import { initializeApp } from "firebase/app";
import {
	getDatabase,
	ref,
	set,
	push,
	onValue,
	remove,
} from "firebase/database";

// The web app's Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyCXMirZZyLdbQRLoGv7p-rcwCpBCohttJw",
	authDomain: "mycourses-7e191.firebaseapp.com",
	databaseURL:
		"https://mycourses-7e191-default-rtdb.europe-west1.firebasedatabase.app",
	projectId: "mycourses-7e191",
	storageBucket: "mycourses-7e191.appspot.com",
	messagingSenderId: "839764947422",
	appId: "1:839764947422:web:fc8fa15567df1a27846d4f",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize & Connect to Realtime database, get a reference to the service
const database = getDatabase(app);

export default function App() {
	//States//
	const [course, setCourse] = useState({
		title: "",
		credits: "",
	});
	const [courses, setCourses] = useState([]);

	//Functions//

	//Read data:
	useEffect(() => {
		onValue(ref(database, "/courses"), (snapshot) => {
			try {
				if (snapshot.exists()) {
					const data = snapshot.val();
					console.log(Object.keys(data));
					console.log(Object.values(data));

					//Fetch keys from the database & iterate (map) over each of them:
					const coursesWithKeys = Object.keys(data).map((key) => ({
						...data[key], //get the properties associated with each key
						key: key, //key property for the key
					}));
					setCourses(coursesWithKeys);
				} else {
					console.log("No data available");
					setCourses([]);
				}
			} catch (error) {
				console.error("Error in fecthing data", error);
			}
		});
	}, []);

	//Save data:
	const handleSave = () => {
		push(ref(database, "/courses"), course);
	};

	//Delete data:
	const deleteItem = (id) => {
		if (id) {
			remove(ref(database, `/courses/${id}`))
				.then(() => console.log("Item deleted succesfully"))
				.catch((error) => console.error("Error in deleting item: ", error));
		}
	};

	const listSeparator = () => {
		return (
			<View
				style={{
					height: 2,
					width: "80%",
					backgroundColor: "#fff",
					marginLeft: "10%",
				}}
			/>
		);
	};

	//Rendering//
	return (
		<View style={styles.container}>
			<TextInput
				value={course.title}
				onChangeText={(value) => setCourse({ ...course, title: value })}
				placeholder="Course title"
				style={{
					marginTop: 5,
					marginBottom: 5,
					fontSize: 15,
					width: 200,
					borderColor: "gray",
					borderWidth: 1,
				}}
			/>
			<TextInput
				value={course.credits}
				onChangeText={(value) => setCourse({ ...course, credits: value })}
				placeholder="Credits"
				style={{
					marginBottom: 5,
					fontSize: 15,
					width: 200,
					borderColor: "gray",
					borderWidth: 1,
				}}
			/>
			<Button title="Add course" onPress={handleSave} />

			<Text
				style={{
					marginTop: 20,
					marginBottom: 10,
					fontSize: 19,
					fontWeight: "bold",
				}}
			>
				Course list
			</Text>
			<FlatList
				data={courses}
				renderItem={({ item }) => (
					<View style={styles.listcontainer}>
						<Text>
							{item.title}, {item.credits} cr
						</Text>
						<Text
							style={{ fontSize: 15, color: "#0000ff" }}
							onPress={() => deleteItem(item.key)}
						>
							{" "}
							delete
						</Text>
					</View>
				)}
				ItemSeparatorComponent={listSeparator}
			/>

			<StatusBar style="auto" />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginTop: 100,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
	},
	listcontainer: {
		flexDirection: "row",
		backgroundColor: "#fff",
		alignItems: "center",
	},
});
