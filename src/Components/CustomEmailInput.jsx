import React from 'react';
import CustomInput from './CustomInput';

const CustomEmailInput = ({ id, name, placeholder, errors, touched }) => {
    return (
        <div>
            <CustomInput
                id={id}
                name={name}
                placeholder={placeholder}
                errors={errors}
                touched={touched}
                bgColor="bg-gray-200"
            />
        </div>
    );
};

export default CustomEmailInput;
