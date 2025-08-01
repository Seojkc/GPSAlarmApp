import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "app_pins";

export const savePin = async (pin) => {
    try{
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(pin));

    } catch (error) {
        console.error("Error saving pin:", error);
    }
};

export const loadPins = async () => {
    try{
        const pinsString = await AsyncStorage.getItem(STORAGE_KEY);
        return pinsString ? JSON.parse(pinsString) : [];
    }catch (error) {
        console.error("Error loading pins:", error);
        return [];
    }
};