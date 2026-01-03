export const CONTACT_INFO = {
    whatsapp: "+917470652857", // For display
    whatsappNumber: "917470652857", // For URLs and logic
    phone: "+917470652857",
    email: "grahasthee@gmail.com",
    instagram: "https://www.instagram.com/grahasthee",
    logo_hex: "#8C907E" // Primary brand color used for wishlist icon
};

export const getWhatsappLink = (message = "") => {
    const baseUrl = `https://wa.me/${CONTACT_INFO.whatsappNumber}`;
    return message ? `${baseUrl}?text=${encodeURIComponent(message)}` : baseUrl;
};
