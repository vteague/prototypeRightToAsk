import React from "react";
import { StyleSheet } from "react-native";
import { useSelector } from "react-redux";

import { getUnselectedTags } from "../store/tags";
import Screen from "../components/Screen";
import TagInput from "../components/TagInput";

function Test(props) {
  const suggestions = useSelector(getUnselectedTags);
  const tagsSelected = useSelector((state) => state.tags.tagsSelected);

  return (
    <Screen>
      <TagInput
        suggestions={suggestions}
        tagsSelected={tagsSelected}
        placeholder="add up to three tags"
        maxTags={3}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({});

export default Test;
