export const initialUser = {
    "first_name": "Super",
    "last_name": "Admin",
    "email": "super-admin@gmail.com",
    "email_verified": true,
    "phone": "+91 8376869095",
    "secondary_email": "sanjayypal113@gmail.com",
    "login_type": "email",
    "role": "super-admin",
    "otp": null,
    "expiration_time": null,
    "token": null,
    "is_verified": true,
    "is_active": true
}



export const generatePassword = (length = 12, includeUppercase = true, includeDigits = true, includeSpecialChars = true) => {
    let charSet = 'abcdefghijklmnopqrstuvwxyz';

    if (includeUppercase) {
        charSet += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    }
    if (includeDigits) {
        charSet += '0123456789';
    }
    if (includeSpecialChars) {
        charSet += '!@#$%^&*()_+[]{}|;:,.<>?';
    }

    if (length < 1) {
        throw new Error('Password length must be at least 1');
    }

    let password = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charSet.length);
        password += charSet[randomIndex];
    }

    return password;
}

