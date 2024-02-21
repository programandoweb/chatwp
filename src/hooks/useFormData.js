import { useState } from 'react';

const useFormData         = () => {
  const [formData, setFormData] =   useState({ name: '', email: '' });
  const onChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };
  return { formData, onChange, setFormData };
};

export default useFormData;
