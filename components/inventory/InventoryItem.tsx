import { View, StyleSheet } from "react-native";
import Text from "../shared/Text";
import { Colors, Inventory } from "../../types";
import { useTheme } from "../../hooks/useTheme";

const InventoryItem = ({ image, name, number }: Inventory) => {
  const { palette } = useTheme();
  const styles = styling(palette);
  return (
    <View style={styles.container}>
      <Text>{name}</Text>
      <Text>{number}</Text>
    </View>
  );
};

const styling = (palette: Colors) =>
  StyleSheet.create({
    container: {
      padding: 20,
      backgroundColor: palette.secondaryBackground,
      width: "50%",
      height: 200,
      justifyContent: "center",
      alignItems: "center",
    },
  });

export default InventoryItem;
