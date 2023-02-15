import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import ModalSettings from "../../components/Modal";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Timer() {
  const [shortBreak, setIsShortBreak] = useState(5 * 60);
  const [pomodoro, setIsPomodoro] = useState(25 * 60);
  const [longBreak, setIsLongBreak] = useState(15 * 60);
  const [time, setTime] = useState(pomodoro);
  const [option, setOption] = useState("pomodoro");
  const [isPaused, setIsPaused] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [isOpenSettings, setIsOpenSettings] = useState(false);

  useEffect(() => {
    async function getTimes() {
      try {
        const jsonValue = await AsyncStorage.getItem("@times");
        if (jsonValue !== null) {
          const { pomodoro, shortBreak, longBreak } = JSON.parse(jsonValue);
          setIsPomodoro(pomodoro);
          setIsShortBreak(shortBreak);
          setIsLongBreak(longBreak);
          setTime(pomodoro);
        }
      } catch (e) {
        console.log(e);
      }
    }
    getTimes();
  }, []);

  useEffect(() => {
    if (!isStarted) return;
    if (isPaused) return;

    if (time === 0) {
      setIsStarted(false);
      setIsPaused(false);
      if (option === "pomodoro") {
        setOption("shortBreak");
        setTime(shortBreak);
      }
      if (option === "shortBreak") {
        setOption("pomodoro");
        setTime(pomodoro);
      }
      if (option === "longBreak") {
        setOption("pomodoro");
        setTime(pomodoro);
      }
    }

    const interval = setInterval(() => {
      setTime((time) => time - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [time, isPaused, isStarted]);

  function toggleOption(option) {
    if (isStarted) {
      return Alert.alert(
        "Pomodoro está rodando",
        "Pare ele para mudar de opção"
      );
    }
    if (option === "pomodoro") {
      setTime(pomodoro);
    }
    if (option === "shortBreak") {
      setTime(shortBreak);
    }
    if (option === "longBreak") {
      setTime(longBreak);
    }
    setOption(option);
  }

  function onStop() {
    if (!isStarted) return;
    Alert.alert("Parar pomodoro", "Deseja parar o pomodoro?", [
      {
        text: "Não",
        style: "cancel",
      },
      {
        text: "Sim",
        onPress: () => {
          setIsStarted(false);
          setIsPaused(false);
          if (option === "pomodoro") setTime(pomodoro);
          if (option === "shortBreak") setTime(shortBreak);
          if (option === "longBreak") setTime(longBreak);
        },
      },
    ]);
  }

  function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes < 10 ? "0" + minutes : minutes}:${
      seconds < 10 ? "0" + seconds : seconds
    }`;
  }

  function handleChangeIntervalValue(value) {
    setTime(value);
    setIsPaused(false);
    setIsStarted(true);
  }
  function onStart() {
    if (isStarted) return;
    if (option === "pomodoro") {
      handleChangeIntervalValue(pomodoro);
    }
    if (option === "shortBreak") {
      handleChangeIntervalValue(shortBreak);
    }
    if (option === "longBreak") {
      handleChangeIntervalValue(longBreak);
    }
  }

  function onPause() {
    if (!isStarted) return;
    setIsPaused((isPaused) => !isPaused);
  }

  async function onSaveTimes(values) {
    setIsPomodoro(values.pomodoro);
    setIsShortBreak(values.shortBreak);
    setIsLongBreak(values.longBreak);
    setIsOpenSettings(false);
    try {
      const jsonValue = JSON.stringify({
        pomodoro: values.pomodoro,
        shortBreak: values.shortBreak,
        longBreak: values.longBreak,
      });
      await AsyncStorage.setItem("@times", jsonValue);
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Pomodoro</Text>
          <TouchableOpacity onPress={() => setIsOpenSettings(true)}>
            <FontAwesome name="gear" size={30} color="#EE5353" />
          </TouchableOpacity>
        </View>
        <View style={styles.content}>
          <View style={styles.timerContainer}>
            <View style={styles.progressBar} />
            <Text style={styles.timer}>{formatTime(time)}</Text>
          </View>
          <View style={styles.buttons}>
            <TouchableOpacity onPress={() => onStart()}>
              <Ionicons name="play" size={50} color="#EE5353" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onPause()}>
              <Ionicons name="pause" size={50} color="#EE5353" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onStop()}>
              <Ionicons name="stop" size={50} color="#EE5353" />
            </TouchableOpacity>
          </View>
          <View style={styles.options}>
            <TouchableOpacity onPress={() => toggleOption("shortBreak")}>
              <Text
                style={
                  option === "shortBreak" ? styles.optionActive : styles.option
                }
              >
                Short break
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                marginHorizontal: 20,
              }}
              onPress={() => toggleOption("pomodoro")}
            >
              <Text
                style={
                  option === "pomodoro" ? styles.optionActive : styles.option
                }
              >
                Pomodoro
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => toggleOption("longBreak")}>
              <Text
                style={
                  option === "longBreak" ? styles.optionActive : styles.option
                }
              >
                Long break
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {isOpenSettings && (
        <ModalSettings
          isOpen={isOpenSettings}
          onClose={() => setIsOpenSettings(false)}
          longBreak={formatTime(longBreak)}
          pomodoro={formatTime(pomodoro)}
          shortBreak={formatTime(shortBreak)}
          onSaveTimes={onSaveTimes}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#EE5353",
  },
  content: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  timerContainer: {
    backgroundColor: "#EE5353",
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  progressBar: {
    width: 170,
    height: 170,
    borderRadius: 85,
    position: "absolute",
    borderWidth: 5,
    borderColor: "#fff",
  },
  timer: {
    fontSize: 48,
    color: "#fff",
  },
  buttons: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  options: {
    width: "100%",
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  optionActive: {
    color: "#EE5353",
    fontSize: 16,
    fontWeight: "bold",
    transform: [{ scale: 1.2 }],
  },

  option: {
    color: "#6c6c6c",
    fontSize: 16,
    fontWeight: "bold",
  },
});
