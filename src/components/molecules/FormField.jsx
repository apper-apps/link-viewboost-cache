import React from "react";
import Label from "@/components/atoms/Label";
import Input from "@/components/atoms/Input";

const FormField = ({ 
  label, 
  error, 
  required = false, 
  children, 
  ...props 
}) => {
  return (
    <div className="space-y-2">
      {label && (
        <Label className={error ? "text-error" : ""}>
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </Label>
      )}
      {children || <Input {...props} />}
      {error && (
        <p className="text-sm text-error">{error}</p>
      )}
    </div>
  );
};

export default FormField;