import { Appearance } from "@stripe/stripe-js";

export const stripeDarkAppearance: Appearance = {
  theme: 'flat',
  variables: {
    colorPrimary: '#108A01', 
    colorBackground: '#000000', // Using a solid color helps Link identify dark mode
    colorText: '#ffffff',
    colorDanger: '#df1b41',
    fontFamily: 'system-ui, sans-serif',
    spacingUnit: '4px',
    borderRadius: '8px',
  },
  rules: {
    '.Input': {
      backgroundColor: 'transparent', 
      border: '1px solid #535353', 
      boxShadow: 'none',
    },
    '.Input:focus': {
      border: '1px solid #108A01', 
      boxShadow: 'none',
    },
    '.Label': {
      color: '#8D8C8C', 
      fontSize: '14px',
      fontWeight: '500',
      marginBottom: '4px',
    },
    // This targets the specific "Block" container used by Stripe Link
    '.Block': {
      backgroundColor: '#1a1a1a', // This fixes the white box background
      borderRadius: '8px',
      border: '1px solid #535353',
    },
    // Ensuring text inside the Link block is white
    '.Text': {
      color: '#ffffff',
    }
  },
};