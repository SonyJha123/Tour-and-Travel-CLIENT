import React from 'react';
import { Field, ErrorMessage } from 'formik';

const CustomInput = ({ id, name, placeholder, type = "text", as = "input", bgColor = "bg-white", ...props }) => {
    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-gray-700">{placeholder}</label>
            <Field
                as={as}
                id={id}
                name={name}
                placeholder={placeholder}
                type={type}
                className={`mt-1 block w-full border border-gray-300 rounded-md p-2 ${bgColor} ${props.errors && props.touched ? 'border-red-500' : ''}`}
                {...props}
            />
            <ErrorMessage name={name} component="div" className="text-red-500 text-sm" />
        </div>
    );
};

export default CustomInput;