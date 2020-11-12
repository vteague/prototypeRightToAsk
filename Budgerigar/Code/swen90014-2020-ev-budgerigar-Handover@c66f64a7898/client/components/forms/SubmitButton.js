import React from "react";
import { formikContext, useFormik, useFormikContext } from "formik";

import AppButton from "../AppButton";

const SubmitButton = ({ title, style, textStyle, disabled }) => {
  const { handleSubmit } = useFormikContext();
  return (
    <AppButton
      style={style}
      textStyle={textStyle}
      title={title}
      onPress={handleSubmit}
      disabled={disabled}
    />
  );
};

export default SubmitButton;
