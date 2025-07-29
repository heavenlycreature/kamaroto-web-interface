import React from 'react';

const FormSection = ({ title, children }) => (
    <fieldset className="space-y-6 border-t-4 border-orange-500 pt-6">
        <legend className="text-2xl font-semibold text-gray-800 px-4 -ml-4">{title}</legend>
        {children}
    </fieldset>
);

export default FormSection;