import { TravelChargingTypes } from "./enums";
import { Option, PlotMargin } from "./types";

export const MOBILE_BREAKPOINT = 768;

export const DEFAULT_WEEKDAY_HOUR_MINIMUM = 2;
export const DEFAULT_WEEKEND_HOUR_MINIMUM = 2;
export const DEFAULT_DEPOSIT = 100.0;
export const DEFAULT_CANCELLATION_FEE = 0;
export const DEFAULT_CANCELLATION_CUTOFF_HOUR = 0;
export const DEFAULT_ADDITIONAL_TERMS_AND_CONDITIONS = "";

export const DEFAULT_PRICING_NAME = "Standard";
export const DEFAULT_TWO_MOVERS_RATE = 169;
export const DEFAULT_THREE_MOVERS_RATE = 229;
export const DEFAULT_FOUR_MOVERS_RATE = 299;
export const DEFAULT_EXTRA_RATE = 65;

export const DEFAULT_INSURANCE_NAME = "Standard";
export const DEFAULT_PREMIUM = 0;
export const DEFAULT_COVERAGE_TYPE = 0.6;
export const DEFAULT_COVERAGE_AMOUNT = 0;
export const DEFAULT_IS_ACTIVE = true;
export const DEFAULT_IS_DEFAULT = true;

export const DEFAULT_CREDIT_CARD_FEE_RATE = 3;

export const DEFAULT_TRAVEL_CHARGING_METHOD = TravelChargingTypes.FLAT;
export const DEFAULT_TRAVEL_RATE = 159;

export const STRIPE_API_VERSION = "2020-08-27";

export const TEMPLATE_TOKEN_REGEX = /{{(.*?)}}/g;

export const DEFAULT_ROOMS = [
  "Bedroom #1",
  "Bedroom #2",
  "Bedroom #3",
  "Bedroom #4",
  "Living Room",
  "Office",
  "Kitchen",
  "Patio",
  "Garage",
  "Basement",
  "Shed",
  "Family Room",
  "Dinning Room",
  "Den",
];

export const TIMEZONE_OPTIONS = [
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Phoenix",
  "America/Anchorage",
  "Pacific/Honolulu",
  "UTC",
];

export const STARTER_CATEGORIES = [
  { name: "Bedroom" },
  { name: "Living Room" },
];

export type StarterItem = {
  name: string;
  size: number;
  weight: number;
};

export const FORECASTED_TIME_OPTIONS: Option[] = [
  { value: "next_7_days", label: "Next 7 days" },
  { value: "next_14_days", label: "Next 14 days" },
  { value: "next_30_days", label: "Next 30 days" },
  { value: "custom", label: "Custom" },
];

export const HISTORICAL_TIME_OPTIONS: Option[] = [
  { value: "last_30_days", label: "Last 30 days" },
  { value: "last_90_days", label: "Last 90 days" },
  { value: "last_365_days", label: "Last 365 days" },
  { value: "custom", label: "Custom" },
];

export const plotMarginFunnel: PlotMargin = {
  top: 54,
  right: 0,
  left: 0,
  bottom: 0,
};

export const X_TICK_STYLE = { fill: "#9CA3AF", fontSize: 12 }; // change to 14/16 etc.
export const Y_TICK_STYLE = { fill: "#9CA3AF", fontSize: 12 };

export const strokeTealFunnel = "rgb(20,184,166)";
export const bandColorsFunnel = [
  "rgb(20 184 166 / 0.28)",
  "rgb(20 184 166 / 0.22)",
  "rgb(20 184 166 / 0.16)",
  "rgb(20 184 166 / 0.10)",
];

export const UNKNOWN_NAME = "Unknown";

export const MS_PER_HOUR = 1000 * 60 * 60;

export const PRE_MOVE_TERMS_AND_CONDITIONS = `
  <h2>Important Information About Your Upcoming Move</h2>

  <p>Hi <strong>[Customer Name]</strong>,</p>

  <p>We’re looking forward to assisting you with your upcoming move! Here’s what you need to know to help ensure everything goes smoothly:</p>

  <ul>
    <li><strong>📦 Move Date:</strong> [Insert Date]</li>
    <li><strong>🕒 Arrival Window:</strong> [Insert Time Range]</li>
    <li><strong>📍 Starting Address:</strong> [Insert Starting Address]</li>
    <li><strong>📍 Destination Address:</strong> [Insert Destination Address]</li>
  </ul>

  <h3>Before Moving Day:</h3>
  <ul>
    <li><strong>Packing:</strong> Have all items securely packed and labeled unless packing services are included.</li>
    <li><strong>Access:</strong> Ensure clear access to entrances, elevators, and arrange any required parking permits.</li>
    <li><strong>Valuables:</strong> Personally transport high-value or sensitive items.</li>
    <li><strong>Appliances:</strong> Disconnect and prepare appliances in advance if they’re being moved.</li>
  </ul>

  <h3>On Moving Day:</h3>
  <ul>
    <li>Be available during the arrival window to review the plan and sign paperwork.</li>
    <li>Clear a path from your door to the moving truck.</li>
    <li>Keep pets and children in a safe area during the move.</li>
  </ul>

  <p>If you have any questions, contact us at <a href="mailto:[Email]">[Email]</a> or call us at <strong>[Phone Number]</strong>.</p>

  <p>We appreciate your trust and look forward to a smooth move!</p>

  <p>
    Best regards,<br />
    <strong>[Your Company Name]</strong><br />
    [Contact Info] <br />
    <a href="[Website URL]">[Website URL]</a>
  </p>
`;

export const MOVE_TERMS_AND_CONDITIONS = `

    <p className="text-base md:text-sm font-bold">Terms and Conditions</p>
    <p className="text-base md:text-sm font-semibold mb-2">For Moving Services</p>

    <p className="text-base md:text-sm">
      <strong>Effective Date:</strong> [Insert Date]
    </p>
    <p className="text-base md:text-sm">
      <strong>Company Name:</strong> [Your Moving Company Name]
    </p>
    <p className="text-base md:text-sm mb-4">
      <strong>Contact Information:</strong> [Phone | Email | Address]
    </p>

    <p className="text-base md:text-sm font-semibold mt-4">1. Services Provided</p>
    <p className="text-base md:text-sm">
      We provide residential and/or commercial moving services, including packing,
      transportation, loading, unloading, and optional storage.
    </p>

    <p className="text-base md:text-sm font-semibold mt-4">2. Estimates & Quotes</p>
    <p className="text-base md:text-sm">• All quotes are non-binding unless stated otherwise.</p>
    <p className="text-base md:text-sm">• Final charges are based on actual time, labor, distance, materials, and services used.</p>
    <p className="text-base md:text-sm">• Additional charges may apply for long carries, stairs, elevator delays, oversized items, packing materials, or specialty items (e.g., pianos, safes).</p>

    <p className="text-base md:text-sm font-semibold mt-4">3. Booking & Cancellation</p>
    <p className="text-base md:text-sm">• A deposit may be required to secure your move date.</p>
    <p className="text-base md:text-sm">• Cancellations made less than 48 hours in advance may incur a cancellation fee or deposit forfeiture.</p>
    <p className="text-base md:text-sm">• Rescheduling is subject to availability.</p>

    <p className="text-base md:text-sm font-semibold mt-4">4. Customer Responsibilities</p>
    <p className="text-base md:text-sm">• Properly pack and label all items unless using our packing service.</p>
    <p className="text-base md:text-sm">• Be present or assign someone authorized during the move.</p>
    <p className="text-base md:text-sm">• Ensure clear access at all locations.</p>
    <p className="text-base md:text-sm">• Remove valuables, documents, or fragile items beforehand.</p>

    <p className="text-base md:text-sm font-semibold mt-4">5. Liability & Claims</p>
    <p className="text-base md:text-sm">• We are not liable for damage to items with pre-existing defects or items packed by the customer.</p>
    <p className="text-base md:text-sm">• Basic liability is $0.60 per pound per item unless otherwise agreed.</p>
    <p className="text-base md:text-sm">• Claims must be submitted in writing within 10 business days of the move.</p>

    <p className="text-base md:text-sm font-semibold mt-4">6. Delays & Force Majeure</p>
    <p className="text-base md:text-sm">
      We are not responsible for delays due to weather, traffic, road conditions,
      mechanical issues, or other events beyond our control.
    </p>

    <p className="text-base md:text-sm font-semibold mt-4">7. Payment Terms</p>
    <p className="text-base md:text-sm">• Payment is due upon completion unless agreed in writing.</p>
    <p className="text-base md:text-sm">• Accepted methods: cash, credit card, or certified check.</p>
    <p className="text-base md:text-sm">• Late payments may incur fees or interest.</p>

    <p className="text-base md:text-sm font-semibold mt-4">8. Right to Refuse Service</p>
    <p className="text-base md:text-sm">
      We may refuse service if the environment is unsafe, illegal items are present,
      or payment cannot be secured.
    </p>

    <p className="text-base md:text-sm font-semibold mt-4">9. Governing Law</p>
    <p className="text-base md:text-sm">
      These terms are governed by the laws of the state/province of [Your Location].
    </p>

    <p className="text-base md:text-sm font-semibold mt-4">10. Agreement</p>
    <p className="text-base md:text-sm">
      By booking and accepting our services, you agree to these Terms and Conditions.
    </p>
`;

export const STARTER_ITEMS: StarterItem[] = [
  { name: "10' Conf. Table", size: 70, weight: 438 },
  { name: "10x10 Storage Unit - Full", size: 800, weight: 5600 },
  { name: "10x10 Storage Unit - Partial", size: 800, weight: 2800 },
  { name: "10x15 Storage Unit - Full", size: 800, weight: 2800 },
  { name: "10x15 Storage Unit - Parial", size: 800, weight: 2800 },
  { name: "10x20 Storage Unit - Full", size: 800, weight: 6000 },
  { name: "10x30 Storage Unit - Full", size: 1200, weight: 8000 },
  { name: "2 Drawer Fire Safe", size: 25, weight: 156 },
  { name: "20x20 Storage Unit - Full", size: 1600, weight: 10000 },
  { name: "3-Drawer Storage Cart", size: 2, weight: 15 },
  { name: "4 Drawer Fire Safe", size: 55, weight: 344 },
  { name: '40"-50" Plasma/LCD TV', size: 5, weight: 35 },
  { name: '51"-65" Plasma/LCD TV', size: 8, weight: 45 },
  { name: "5x10 Storage Unit - Full", size: 400, weight: 2800 },
  { name: "5x10 Storage Unit - Partial", size: 400, weight: 1400 },
  { name: "6' Conf. Table", size: 30, weight: 188 },
  { name: '66"-75" Plasma/LCD TV', size: 10, weight: 55 },
  { name: '75"+ Plasma/LCD TV', size: 15, weight: 75 },
  { name: "Animal Mounts (Large)", size: 10, weight: 40 },
  { name: "Animal Mounts (Small)", size: 6, weight: 25 },
  { name: "Area Rug", size: 6, weight: 20 },
  { name: "Armoire/Ward", size: 70, weight: 490 },
  { name: "Bakers Rack", size: 12, weight: 79 },
  { name: "Bar Stools", size: 5, weight: 35 },
  { name: "BBQ Grill", size: 10, weight: 70 },
  { name: "Bed, Bunk", size: 34, weight: 236 },
  { name: "Bed, Crib/Tots", size: 20, weight: 140 },
  { name: "Bed, Day Bed", size: 35, weight: 245 },
  { name: "Bed, Full/Twin", size: 55, weight: 385 },
  { name: "Bed, King/Qn", size: 70, weight: 490 },
  { name: "Bed, Water Bed", size: 25, weight: 175 },
  { name: "Bench", size: 7, weight: 30 },
  { name: "Big Screen 50 In Plus", size: 35, weight: 245 },
  { name: "Bikes", size: 10, weight: 70 },
  { name: "Bookcase", size: 20, weight: 140 },
  { name: "Break Table", size: 20, weight: 125 },
  { name: "Buffet/Sidebar", size: 30, weight: 210 },
  { name: "Bulletin Boards", size: 2, weight: 13 },
  { name: "Car Seat", size: 5, weight: 40 },
  { name: "Chair, Arm Chair", size: 25, weight: 156 },
  { name: "Chair, Executive", size: 20, weight: 125 },
  { name: "Chair, Secretary", size: 15, weight: 94 },
  { name: "Chair, Small", size: 5, weight: 31 },
  { name: "Change Table", size: 4, weight: 28 },
  { name: "Chest/Drawers", size: 40, weight: 280 },
  { name: "Christmas Tree - Large", size: 10, weight: 300 },
  { name: "Church Pews", size: 100, weight: 250 },
  { name: "Clock", size: 15, weight: 94 },
  { name: "Coat Rack", size: 5, weight: 31 },
  { name: "Coffee Maker", size: 2, weight: 13 },
  { name: "Coffee/Sofa Table", size: 8, weight: 56 },
  { name: "Computer Cart", size: 25, weight: 156 },
  { name: "Computer Components", size: 2, weight: 14 },
  { name: "Computer Server", size: 36, weight: 500 },
  { name: "Cooler", size: 5, weight: 15 },
  { name: "Credenza", size: 60, weight: 420 },
  { name: "Cube Shelf", size: 4, weight: 35 },
  { name: "Curio Cabinet", size: 15, weight: 105 },
  { name: "D.D. Fridge", size: 55, weight: 385 },
  { name: "Dehumidifier", size: 5, weight: 35 },
  { name: "Desk, Computer", size: 30, weight: 188 },
  { name: "Desk, Executive", size: 35, weight: 219 },
  { name: "Desk, Extension", size: 10, weight: 63 },
  { name: "Desk, Extension/Pcs", size: 10, weight: 70 },
  { name: "Desk, Hutch", size: 12, weight: 79 },
  { name: "Desk, Metal", size: 35, weight: 219 },
  { name: "Desk, Off/Roll", size: 35, weight: 245 },
  { name: "Desk, Office Desk", size: 35, weight: 219 },
  { name: "Desk, Small", size: 20, weight: 125 },
  { name: "Desk, Student", size: 20, weight: 140 },
  { name: "Desk/Chair Mat", size: 5, weight: 31 },
  { name: "Dining Table", size: 30, weight: 210 },
  { name: "Dishwasher", size: 25, weight: 175 },
  { name: "Dolly / Hand Truck", size: 3, weight: 30 },
  { name: "Dr. Exam Table", size: 60, weight: 200 },
  { name: "Dresser", size: 60, weight: 420 },
  { name: "Drum Set", size: 35, weight: 150 },
  { name: "Dryer", size: 25, weight: 175 },
  { name: "Elliptical", size: 10, weight: 175 },
  { name: "End Tables", size: 5, weight: 35 },
  { name: "Ent Center", size: 60, weight: 420 },
  { name: "Exercise Bike", size: 10, weight: 70 },
  { name: "Fan", size: 6, weight: 40 },
  { name: "File, 2 Drawer", size: 10, weight: 63 },
  { name: "File, 3 Drawer", size: 15, weight: 94 },
  { name: "File, 4 Drawer", size: 20, weight: 125 },
  { name: "File, 5 Drawer", size: 25, weight: 156 },
  { name: "Folding Chair", size: 1, weight: 10 },
  { name: "Folding Table", size: 5, weight: 31 },
  { name: "Foosball Table", size: 20, weight: 205 },
  { name: "Fridge/Freeze", size: 45, weight: 315 },
  { name: "Ft. of Clothes", size: 2, weight: 14 },
  { name: "Futon", size: 25, weight: 150 },
  { name: "Generator", size: 18, weight: 200 },
  { name: "Glass Shelves", size: 1, weight: 7 },
  { name: "Glass Top Larger", size: 10, weight: 70 },
  { name: "Glass Tops Sm/Med.", size: 2, weight: 14 },
  { name: "Glider", size: 12, weight: 79 },
  { name: "Golf Club Set", size: 4, weight: 60 },
  { name: "Grandfather Clock", size: 23, weight: 157 },
  { name: "Gun Cabinet", size: 25, weight: 175 },
  { name: "Hamper", size: 2, weight: 15 },
  { name: "Hide-a-bed", size: 50, weight: 350 },
  { name: "High Chair", size: 8, weight: 30 },
  { name: "Hospital Bed", size: 60, weight: 400 },
  { name: "Hot Tub", size: 250, weight: 1000 },
  { name: "Iron Board", size: 2, weight: 14 },
  { name: "Jewelry Box", size: 8, weight: 50 },
  { name: "Kitchen Cart", size: 5, weight: 35 },
  { name: "Kitchen Table", size: 20, weight: 140 },
  { name: "Ladder", size: 12, weight: 79 },
  { name: "Lamps", size: 2, weight: 14 },
  { name: "Large Bookcase", size: 40, weight: 250 },
  { name: "Large Chairs", size: 25, weight: 175 },
  { name: "Large Copier & Stand", size: 45, weight: 281 },
  { name: "Large Marble Top", size: 20, weight: 125 },
  { name: "Large Speaker", size: 6, weight: 40 },
  { name: "Lawnmower", size: 15, weight: 105 },
  { name: "Liquor Cabinet", size: 20, weight: 150 },
  { name: "Locker/Chest", size: 15, weight: 105 },
  { name: "Loveseat", size: 35, weight: 245 },
  { name: "Luggage, Suitcases", size: 3, weight: 20 },
  { name: "Massage Chair", size: 5, weight: 100 },
  { name: "Metal Shelf", size: 10, weight: 70 },
  { name: "Microwave", size: 5, weight: 31 },
  { name: "Mirrors", size: 5, weight: 35 },
  { name: "Motorcycle", size: 85, weight: 800 },
  { name: "Nightstands", size: 5, weight: 35 },
  { name: "Boxes", size: 3, weight: 18 },
  { name: "Ottoman", size: 3, weight: 21 },
  { name: "Patio Chair", size: 3, weight: 21 },
  { name: "Patio Chaise Lounge", size: 40, weight: 100 },
  { name: "Patio End Table", size: 10, weight: 40 },
  { name: "Hammock", size: 40, weight: 150 },
  { name: "Patio Loveseat", size: 25, weight: 100 },
  { name: "Patio Picnic Table", size: 50, weight: 150 },
  { name: "Patio Table", size: 20, weight: 140 },
  { name: "Pc.China/Hutch", size: 35, weight: 245 },
  { name: "Piano - Baby Grand (Add $100)", size: 350, weight: 800 },
  { name: "Piano - Grand (Add $100)", size: 350, weight: 2450 },
  { name: "Piano - Spinet", size: 150, weight: 400 },
  { name: "Piano - Upright", size: 84, weight: 588 },
  { name: "Piano/Organ", size: 75, weight: 525 },
  { name: "Picture", size: 2, weight: 14 },
  { name: "Ping Pong Table", size: 400, weight: 200 },
  { name: "Pool Table (Add Cost)", size: 400, weight: 1000 },
  { name: "Portable A/C", size: 4, weight: 50 },
  { name: "Portable Fireplace", size: 4, weight: 75 },
  { name: "Pressure Washer", size: 10, weight: 100 },
  { name: "Printer", size: 10, weight: 63 },
  { name: "Recliner", size: 25, weight: 175 },
  { name: "Rocking Chair", size: 18, weight: 75 },
  { name: "Row Machine", size: 10, weight: 70 },
  { name: "Safe (1 For each 100lbs)", size: 15, weight: 100 },
  { name: "Sectional Sofa Piece", size: 12, weight: 79 },
  { name: "Sew Mach/Toybox", size: 10, weight: 70 },
  { name: "Shredder", size: 3, weight: 19 },
  { name: "Small Bookcase", size: 20, weight: 125 },
  { name: "Snow Blower", size: 25, weight: 100 },
  { name: "Sofa/Couch", size: 45, weight: 315 },
  { name: "Stair Stepper", size: 10, weight: 70 },
  { name: "Standing Desk", size: 40, weight: 120 },
  { name: "Stereo/DVD", size: 2, weight: 14 },
  { name: "Storage Cabinet", size: 17, weight: 118 },
  { name: "Stove", size: 25, weight: 175 },
  { name: "Stroller", size: 15, weight: 35 },
  { name: "Subwoofer", size: 2, weight: 30 },
  { name: "Table Saw", size: 10, weight: 75 },
  { name: "Toolchest", size: 10, weight: 70 },
  { name: "Toys Each", size: 3, weight: 20 },
  { name: "Trash Can", size: 6, weight: 40 },
  { name: "Treadmill", size: 10, weight: 70 },
  { name: "TV, 13-20 In", size: 10, weight: 70 },
  { name: "TV, 21-27in", size: 15, weight: 105 },
  { name: "TV, 28-39 In", size: 23, weight: 157 },
  { name: "TV/Stereo Stand", size: 5, weight: 35 },
  { name: "Vacuum", size: 3, weight: 25 },
  { name: "Vanity", size: 20, weight: 140 },
  { name: "Walker", size: 2, weight: 7 },
  { name: "Wall Unit Secs", size: 10, weight: 70 },
  { name: "Wardrobe Box", size: 10, weight: 70 },
  { name: "Washer", size: 25, weight: 175 },
  { name: "Water Cooler", size: 15, weight: 94 },
  { name: "Weight Bench", size: 5, weight: 35 },
  { name: "Weights per 100 Lb.", size: 14, weight: 100 },
  { name: "Wheel Barrow", size: 6, weight: 40 },
  { name: "Wheel Chair", size: 25, weight: 150 },
  { name: "Wine Rack", size: 3, weight: 35 },
  { name: "Workbench", size: 15, weight: 105 },
  { name: "Yard Tools", size: 1, weight: 2 },
];

export const TEMPLATE_VARIABLES = {
  internal_review_link: "internal_review_link",
  quote_link: "quote_link",
  documents_link: "documents_link",
  live_move_link: "live_move_link",
  payment_link: "payment_link",
  invite_link: "invite_link",
  customer_name: "customer_name",
  move_date: "move_date",
  external_review_link: "external_review_link",
} as const;
