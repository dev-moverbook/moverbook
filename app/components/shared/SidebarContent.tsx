import { Button } from "../ui/button";

const SidebarContent = () => (
  <nav className="flex flex-col p-4 gap-2">
    <Button variant="ghost" className="justify-start">
      Dashboard
    </Button>
    <Button variant="ghost" className="justify-start">
      Customers
    </Button>
    <Button variant="ghost" className="justify-start">
      Settings
    </Button>
  </nav>
);

export default SidebarContent;
