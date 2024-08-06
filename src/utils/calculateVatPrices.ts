export function calculateVatPrice(price: number, vatPercentage: number) {
    if (typeof price !== 'number' || typeof vatPercentage !== 'number') {
      throw new Error('Both price and VAT percentage must be numbers');
    }
    
    const vatAmount = (price * vatPercentage) / 100;
    const totalPrice = price + vatAmount;
  
    return {
      vatAmount: vatAmount.toFixed(2),
      totalPrice: totalPrice.toFixed(2)
    };
  }
  