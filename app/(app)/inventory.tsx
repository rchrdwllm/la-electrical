import { View, StyleSheet } from "react-native";
import Text from "../../components/shared/Text";
import { Colors } from "../../types";
import { useTheme } from "../../hooks/useTheme";
import { useEffect } from "react";
import { StatusBar, setStatusBarStyle } from "expo-status-bar";
import ListHeader from "../../components/shared/ListHeader";
import TextInput from "../../components/shared/TextInput";
import InventoryList from "../../components/inventory/InventoryList";

const Inventory = () => {
  const { theme, palette } = useTheme();
  const styles = styling(palette);

  useEffect(() => {
    setTimeout(() => {
      setStatusBarStyle(theme === "light" ? "dark" : "light");
    }, 570);
  }, [theme]);

  return (
    <View style={styles.container}>
      <StatusBar animated style={theme === "light" ? "dark" : "light"} />
      <ListHeader></ListHeader>
      <TextInput style={styles.textInput} placeholder={"Search Inventory"} />
      <InventoryList />
    </View>
  );
};

const styling = (palette: Colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: palette.primaryBackground,
    },
    text: {
      color: palette.primaryText,
      fontSize: 23,
    },
    textInput: {
      marginTop: 16,
    },
  });

export default Inventory;
