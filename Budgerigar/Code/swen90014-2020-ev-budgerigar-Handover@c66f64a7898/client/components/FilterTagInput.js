import React from "react";
import { StyleSheet, Text, View, TouchableHighlight } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import AutoTags from "react-native-tag-autocomplete";
import { changeFilter } from "../store/questions";

import * as tagActions from "../store/tags";

function TagInput({ suggestions, tagsSelected, placeholder, maxTags = 0 }) {
  const dispatch = useDispatch();

  const handleAddition = (tag) => {
    if (maxTags != 0 && tagsSelected.length >= maxTags) return;
    if (tag.name.length < 3) return;

    for (const i in tagsSelected) {
      if (tagsSelected[i].name.toUpperCase() === tag.name.toUpperCase()) return;
    }

    const newTagIds = tagsSelected.map((t) => t.tagId);
    newTagIds.push(tag.tagId);
    dispatch(changeFilter({ tags: newTagIds }));
  };

  const handleDelete = (index) => {
    const newTags = tagsSelected.map((t) => t.tagId);
    newTags.splice(index, 1);
    dispatch(changeFilter({ tags: newTags }));
  };

  const filterSortData = (query) => {
    if (!query || query.trim() == "" || !suggestions) {
      return;
    }
    let suggs = suggestions;
    let results = [];
    query = query.toUpperCase();
    suggs.forEach((i) => {
      if (i.name.toUpperCase().includes(query)) {
        results.push(i);
      }
    });

    results.sort((a, b) => b.count - a.count);
    return results;
  };

  const renderTags = () => {
    const tagMargins = { marginVertical: 5 };

    return (
      <View style={styles.tags}>
        {tagsSelected.map((t, i) => {
          return (
            <TouchableHighlight
              key={i}
              style={[tagMargins, styles.tag]}
              onPress={() => handleDelete(i)}
            >
              <Text>{t.name}</Text>
            </TouchableHighlight>
          );
        })}
      </View>
    );
  };

  return (
    <AutoTags
      placeholder={placeholder}
      suggestions={suggestions}
      tagsSelected={tagsSelected}
      handleAddition={handleAddition}
      handleDelete={handleDelete}
      keyExtractor={(tag) => tag.name}
      renderSuggestion={(item) => (
        <Text style={styles.suggestions}>
          {item.name} (used {item.count} times)
        </Text>
      )}
      renderTags={renderTags}
      filterData={filterSortData}
      inputContainerStyle={styles.inputContainerStyle}
      style={{ backgroundColor: "#efefef" }}
      autoFocus={false}
    />
  );
}

const styles = StyleSheet.create({
  suggestions: {
    paddingHorizontal: 5,
    paddingVertical: 5,
    width: "100%",
    marginHorizontal: 0,
  },
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-start",
    backgroundColor: "#efefef",
    width: 300,
  },
  tag: {
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
    height: 30,
    marginLeft: 5,
    padding: 8,
    borderRadius: 30,
  },
  inputContainerStyle: {
    borderRadius: 0,
    paddingLeft: 5,
    height: 40,
    width: 300,
    justifyContent: "center",
    borderColor: "transparent",
    alignItems: "stretch",
    backgroundColor: "#efefef",
  },
});

export default TagInput;
