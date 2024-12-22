import axios from "axios";
import { Alert } from "react-native";

export const handleError = (error: any) => {
    if (axios.isAxiosError(error)) {
      const errors = error.response?.data.errors;
      if (errors) {
        Alert.alert(errors[Object.keys(errors)[0]][0]);
      } else {
        Alert.alert(error.response?.data.Message);
      }
    }
  };
  