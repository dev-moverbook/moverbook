declare module "next-pwa" {
  import { Plugin } from "next"; // Adjust if needed depending on next-pwa exports

  function withPWA(config: object): object;

  export default withPWA;
}
