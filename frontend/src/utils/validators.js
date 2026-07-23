// Email Validation

export const validateEmail = (email) => {
    return /^\S+@\S+\.\S+$/.test(email);
};

// Phone Validation

export const validatePhone = (phone) => {
    return /^\d{10}$/.test(phone);
};


export const validateRegisterForm = (config, formData) => {
    const errors = {};

    config.fields.forEach((field) => {
        if (field.required && !formData[field.name]) {
            errors[field.name] = `${field.label.replace(
                " (Optional)",
                ""
            )} is required`;
        }
    });

    if (
        formData.password &&
        formData.confirmPassword &&
        formData.password !== formData.confirmPassword
    ) {
        errors.confirmPassword = "Passwords do not match";
    }

    if (formData.phone && !validatePhone(formData.phone)) {
        errors.phone = "Enter a valid 10 digit mobile number";
    }

    if (formData.email && !validateEmail(formData.email)) {
        errors.email = "Enter a valid email address";
    }

    return errors;
};