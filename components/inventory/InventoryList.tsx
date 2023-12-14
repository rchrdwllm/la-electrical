import { FlatList, View } from "react-native";
import { inventoryItems } from "../../constants/inventory-items";
import InventoryItem from "./InventoryItem";

const InventoryList = () => {
  return (
    <View>
      <FlatList
        data={inventoryItems}
        renderItem={({ item }) => <InventoryItem {...item} />}
        keyExtractor={(item) => item.name}
        numColumns={2}
        key={"_"}
        contentContainerStyle={{ margin: 16, gap: 16 }}
      />
    </View>
  );
};

export default InventoryList;
