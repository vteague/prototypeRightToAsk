import React from "react";
import { useFormikContext } from "formik";
import { View } from "react-native";

import AppTextInput from "../AppTextInput";
import ErrorMessage from "./ErrorMessage";

const AppFormField = ({
  name,
  style,
  direction = "column",
  errorStyle,
  textStyle,
  width,
  ...otherProps
}) => {
  const {
    setFieldTouched,
    handleChange,
    errors,
    touched,
    values,
  } = useFormikContext();

  return (
    <View style={{ flexDirection: direction, width }}>
      <AppTextInput
        onBlur={() => {
          if (values[name]) setFieldTouched(name, true);
          else setFieldTouched(name, false);
        }}
        style={style}
        textStyle={textStyle}
        onChangeText={handleChange(name)}
        {...otherProps}
      />
      <ErrorMessage
        style={errorStyle}
        visible={touched[name]}
        error={errors[name]}
      />
    </View>
  );
};

export default AppFormField;
