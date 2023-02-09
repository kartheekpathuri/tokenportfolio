export const getHoldingValue = (price: number, qty: number): number => {
    return +(qty * price).toFixed(2);
};


