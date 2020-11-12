import React from "react";
import { View, StyleSheet } from "react-native";
import AppText from "../components/AppText";
import FilterTagInput from "../components/FilterTagInput";
import { useSelector } from "react-redux";
import { getTagsByIdArray } from "../store/tags";

function FilterPanel() {
  const tagsSelectedIDArray = useSelector(
    (state) => state.questions.filter.tags
  );

  const tagsSelected = useSelector(getTagsByIdArray(tagsSelectedIDArray));
  const suggestions = useSelector((state) =>
    state.tags.tags.filter((t) => !tagsSelectedIDArray.includes(t.tagId))
  );

  return (
    <View style={styles.container}>
      <AppText style={{ textAlign: "center" }}>Filter by tags:</AppText>
      <View
        style={{
          alignSelf: "center",
          borderRadius: 15,
          overflow: "hidden",
          width: 300,
        }}
      >
        <FilterTagInput
          suggestions={suggestions}
          tagsSelected={tagsSelected}
          placeholder="enter tags to filter questions by"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 15,
    backgroundColor: "#dddddd",
    marginBottom: 5,
    overflow: "hidden",
    paddingBottom: 5,
    paddingTop: 5,
  },
});

export default FilterPanel;
