import {
  Pressable,
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Button,
  KeyboardAvoidingView,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useState } from "react";
import MaskInput from "react-native-mask-input";

export default function ModalSettings({
  isOpen,
  onClose,
  shortBreak,
  pomodoro,
  longBreak,
  onSaveTimes,
}) {
  const [shortBreakSettings, setIsShortBreakSettings] = useState(shortBreak);
  const [pomodoroSettings, setIsPomodoroSettings] = useState(pomodoro);
  const [longBreakSettings, setIsLongBreakSettings] = useState(longBreak);

  function transformValueDigitToTime(value) {
    const minutes = value.slice(0, 2);
    const seconds = value.slice(3, 5);
    return Number(minutes) * 60 + Number(seconds);
  }
  function onSaveTimesSettings() {
    const shortBreakTime = transformValueDigitToTime(shortBreakSettings);
    const pomodoroTime = transformValueDigitToTime(pomodoroSettings);
    const longBreakTime = transformValueDigitToTime(longBreakSettings);
    if (shortBreakTime >= pomodoroTime)
      return alert(
        "O tempo do short break deve ser menor que o tempo do pomodoro"
      );
    if (pomodoroTime === 0 || shortBreakTime === 0 || longBreakTime === 0)
      return alert("O tempo não pode ser 0");
    onSaveTimes({
      shortBreak: shortBreakTime,
      pomodoro: pomodoroTime,
      longBreak: longBreakTime,
    });
  }

  return (
    <Modal
      animationType="slide"
      transparent
      visible={isOpen}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={{
          flex: 1,
        }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <SafeAreaView style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.header}>
              <Text>Configurações</Text>
              <TouchableOpacity
                onPress={onClose}
                style={{
                  marginLeft: 24,
                }}
              >
                <AntDesign name="close" size={24} color="black" />
              </TouchableOpacity>
            </View>
            <View style={styles.content}>
              <View style={styles.wrapper}>
                <Text
                  style={{
                    marginRight: 24,
                  }}
                >
                  Short break
                </Text>
                <MaskInput
                  value={shortBreakSettings}
                  onChangeText={(masked, unmasked) => {
                    setIsShortBreakSettings(unmasked);
                  }}
                  style={styles.input}
                  keyboardType="numeric"
                  mask={[/[0-5]/, /[0-9]/, ":", /[0-5]/, /[0-9]/]}
                />
              </View>
              <View style={styles.wrapper}>
                <Text
                  style={{
                    marginRight: 24,
                  }}
                >
                  Pomodoro
                </Text>
                <MaskInput
                  value={pomodoroSettings}
                  onChangeText={(masked, unmasked) => {
                    setIsPomodoroSettings(unmasked);
                  }}
                  style={styles.input}
                  keyboardType="numeric"
                  mask={[/[0-5]/, /[0-9]/, ":", /[0-5]/, /[0-9]/]}
                />
              </View>
              <View style={styles.wrapper}>
                <Text
                  style={{
                    marginRight: 24,
                  }}
                >
                  Large break
                </Text>
                <MaskInput
                  value={longBreakSettings}
                  onChangeText={(masked, unmasked) => {
                    setIsLongBreakSettings(unmasked);
                  }}
                  keyboardType="numeric"
                  style={styles.input}
                  mask={[/[0-5]/, /[0-9]/, ":", /[0-5]/, /[0-9]/]}
                />
              </View>
            </View>
            <TouchableOpacity
              onPress={onSaveTimesSettings}
              style={{
                backgroundColor: "#EE5353",
                padding: 8,
                borderRadius: 4,
                width: 150,
                marginTop: 24,
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  textAlign: "center",
                  width: "100%",
                }}
              >
                Salvar
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  content: {
    marginTop: 24,
    justifyContent: "space-between",
  },
  wrapper: {
    marginVertical: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  input: {
    width: 70,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 4,
    padding: 4,
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalContainer: {},

  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});
