import { Appearance } from "@stripe/stripe-js";

export const stripeDarkAppearance: Appearance = {
  theme: 'flat',
  variables: {
    colorPrimary: '#108A01', 
    colorBackground: 'transparent', 
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
  },
};