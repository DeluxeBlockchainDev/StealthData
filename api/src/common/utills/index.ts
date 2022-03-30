export const calculateAnnualPrice = (price, discount= 0) => +parseFloat(((price - (price*discount/100)) * 12).toString()).toFixed(2)
