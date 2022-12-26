export const isValidPhone = (phone: string) =>
  /((\+84|0)[0-9])+([0-9]{8})\b/.test(phone);

export const validatePhone = (phone: string): string | boolean => {
  if (!isValidPhone(phone.replace(/\s/g, ''))) {
    return 'Vui lòng nhập đúng số điện thoại 10 số';
  }
  return true;
};

export const validateName = (name: string): string | boolean => {
  const str = name.replace(/\s\s+/gu, ' ').trim();
  if (str.length > 25) {
    return 'Không nhập nhiều hơn 25 ký tự';
  }
  return true;
};

export const validatePW = (name: string): string | boolean => {
  const str = name.replace(/\s\s+/gu, ' ').trim();
  if (str.length < 6) {
    return 'Mật khẩu bắt buộc 6 số';
  }
  return true;
};
