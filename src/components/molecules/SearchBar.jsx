import React from "react";
import Input from "@/components/atoms/Input";
import ApperIcon from "@/components/ApperIcon";

const SearchBar = ({ 
  value, 
  onChange, 
  placeholder = "Search...", 
  className = "" 
}) => {
  return (
    <div className={`relative ${className}`}>
      <ApperIcon 
        name="Search" 
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" 
      />
      <Input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="pl-10"
      />
    </div>
  );
};

export default SearchBar;