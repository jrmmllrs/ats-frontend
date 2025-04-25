
export const formatEnumForDisplay = (enumKey) => {
    return enumKey.toLowerCase().split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};