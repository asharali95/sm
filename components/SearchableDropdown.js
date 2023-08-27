import React, { useState } from "react";
import AsyncSelect from "react-select/async";
import axios from "axios";
import { debounce } from "lodash";
import makeAnimated from "react-select/animated";

const SearchableDropdown = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const animatedComponents = makeAnimated();
  // Load options from MongoDB
  const loadOptions = debounce(async (inputValue, callback) => {
    if (!inputValue) {
      return [];
    }
    if (inputValue) {
      try {
        const response = await axios.get(`/api/public/search?id=${inputValue}`);
        const data = response?.data?.foundItem;
        const options = data.map((item) => ({
          value: item.skill,
          label: item.skill,
        }));
        callback(options);
      } catch (error) {
        console.error(error);
      }
    }
  }, 500);
  // Handle option selection
  const handleChange = async (selectedOption) => {
    setSelectedOption(selectedOption);
  };

  return (
    <div className="w-40">
      <AsyncSelect
        cacheOptions={false}
        isMulti
        defaultOptions
        components={animatedComponents}
        loadOptions={loadOptions}
        onChange={handleChange}
        value={selectedOption}
      />
    </div>
  );
};

export default SearchableDropdown;
