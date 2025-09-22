// "use client";

// import * as React from "react";
// import { Drawer as DrawerPrimitive } from "vaul";

// import { cn } from "@/lib/utils";

// const Drawer = ({
//   shouldScaleBackground = true,
//   ...props
// }: React.ComponentProps<typeof DrawerPrimitive.Root>) => (
//   <DrawerPrimitive.Root
//     shouldScaleBackground={shouldScaleBackground}
//     {...props}
//   />
// );
// Drawer.displayName = "Drawer";

// const DrawerTrigger = DrawerPrimitive.Trigger;

// const DrawerPortal = DrawerPrimitive.Portal;

// const DrawerClose = DrawerPrimitive.Close;

// const DrawerOverlay = React.forwardRef<
//   React.ElementRef<typeof DrawerPrimitive.Overlay>,
//   React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay>
// >(({ className, ...props }, ref) => (
//   <DrawerPrimitive.Overlay
//     ref={ref}
//     className={cn("fixed inset-0 z-50 bg-black/80", className)}
//     {...props}
//   />
// ));
// DrawerOverlay.displayName = DrawerPrimitive.Overlay.displayName;

// type DrawerContentProps = React.ComponentPropsWithoutRef<
//   typeof DrawerPrimitive.Content
// > & {
//   /** Set a fixed height in viewport units, e.g. 80 -> 80vh */
//   heightVh?: number;
//   /** Set a maximum height in viewport units, e.g. 90 -> max-height: 90vh */
//   maxHeightVh?: number;
// };

// const DrawerContent = React.forwardRef<
//   React.ElementRef<typeof DrawerPrimitive.Content>,
//   DrawerContentProps
// >(({ className, children, heightVh, maxHeightVh, style, ...props }, ref) => {
//   const dynamicStyle: React.CSSProperties = {
//     ...(heightVh ? { height: `${heightVh}vh` } : {}),
//     ...(maxHeightVh ? { maxHeight: `${maxHeightVh}vh` } : {}),
//     ...style,
//   };

//   return (
//     <DrawerPortal>
//       <DrawerOverlay />
//       <DrawerPrimitive.Content
//         ref={ref}
//         className={cn(
//           "fixed inset-x-0 bottom-0 z-50 mt-24 flex flex-col rounded-t-[10px] border-t border-grayCustom bg-black",
//           className
//         )}
//         style={dynamicStyle}
//         {...props}
//       >
//         {/* Handle */}
//         <div className="mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted" />

//         {/* Scrollable content wrapper */}
//         <div className="flex-1 overflow-y-auto px-4 pb-10">{children}</div>
//       </DrawerPrimitive.Content>
//     </DrawerPortal>
//   );
// });
// DrawerContent.displayName = "DrawerContent";

// const DrawerHeader = ({
//   className,
//   ...props
// }: React.HTMLAttributes<HTMLDivElement>) => (
//   <div
//     className={cn("grid gap-1.5 p-4 text-center sm:text-left", className)}
//     {...props}
//   />
// );
// DrawerHeader.displayName = "DrawerHeader";

// const DrawerFooter = ({
//   className,
//   ...props
// }: React.HTMLAttributes<HTMLDivElement>) => (
//   <div
//     className={cn("mt-auto flex flex-col gap-2 p-4", className)}
//     {...props}
//   />
// );
// DrawerFooter.displayName = "DrawerFooter";

// const DrawerTitle = React.forwardRef<
//   React.ElementRef<typeof DrawerPrimitive.Title>,
//   React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Title>
// >(({ className, ...props }, ref) => (
//   <DrawerPrimitive.Title
//     ref={ref}
//     className={cn(
//       "text-lg font-semibold text-white leading-none tracking-tight mb-2 mt-8",
//       className
//     )}
//     {...props}
//   />
// ));
// DrawerTitle.displayName = DrawerPrimitive.Title.displayName;

// const DrawerDescription = React.forwardRef<
//   React.ElementRef<typeof DrawerPrimitive.Description>,
//   React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Description>
// >(({ className, ...props }, ref) => (
//   <DrawerPrimitive.Description
//     ref={ref}
//     className={cn("text-sm text-grayCustom2 mb-4", className)}
//     {...props}
//   />
// ));
// DrawerDescription.displayName = DrawerPrimitive.Description.displayName;

// export {
//   Drawer,
//   DrawerPortal,
//   DrawerOverlay,
//   DrawerTrigger,
//   DrawerClose,
//   DrawerContent,
//   DrawerHeader,
//   DrawerFooter,
//   DrawerTitle,
//   DrawerDescription,
// };

"use client";

import * as React from "react";
import { Drawer as DrawerPrimitive } from "vaul";
import { cn } from "@/lib/utils";

/**
 * Mobile keyboard fix:
 * - Keeps the bottom sheet above iOS input accessory bar
 * - Uses dynamic viewport units (dvh)
 * - Adds safe-area + keyboard-aware padding
 * - Sticky footer that lifts with the keyboard
 */

const Drawer = ({
  shouldScaleBackground = true,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Root>) => (
  <DrawerPrimitive.Root
    shouldScaleBackground={shouldScaleBackground}
    {...props}
  />
);
Drawer.displayName = "Drawer";

const DrawerTrigger = DrawerPrimitive.Trigger;
const DrawerPortal = DrawerPrimitive.Portal;
const DrawerClose = DrawerPrimitive.Close;

const DrawerOverlay = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Overlay
    ref={ref}
    className={cn("fixed inset-0 z-50 bg-black/80", className)}
    {...props}
  />
));
DrawerOverlay.displayName = DrawerPrimitive.Overlay.displayName;

type DrawerContentProps = React.ComponentPropsWithoutRef<
  typeof DrawerPrimitive.Content
> & {
  /** Set a fixed height in viewport units, e.g. 80 -> 80dvh (keyboard-aware) */
  heightVh?: number;
  /** Set a maximum height in viewport units, e.g. 90 -> max-height: 90dvh */
  maxHeightVh?: number;
};

const DrawerContent = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Content>,
  DrawerContentProps
>(({ className, children, heightVh, maxHeightVh, style, ...props }, ref) => {
  // Keep a CSS var --kb updated with the keyboard overlap using VisualViewport

  const dynamicStyle: React.CSSProperties = {
    ...(heightVh ? { height: `${heightVh}dvh` } : {}),
    ...(maxHeightVh ? { maxHeight: `${maxHeightVh}dvh` } : {}),
    ...style,
  };

  return (
    <DrawerPortal>
      <DrawerOverlay />
      <DrawerPrimitive.Content
        ref={ref}
        className={cn(
          "fixed inset-x-0 bottom-0 z-50 mt-24 flex flex-col rounded-t-[10px] border-t border-grayCustom bg-black",
          className
        )}
        style={dynamicStyle}
        {...props}
      >
        {/* Handle */}
        <div className="mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted" />

        {/* Scrollable content (adds padding for safe area + keyboard + footer) */}
        <div
          className="flex-1 overflow-y-auto "
          style={{
            // Footer height ~72px; keep content end above footer + keyboard + safe area
            paddingBottom:
              "calc(env(safe-area-inset-bottom) + var(--kb, 0px) + 72px)",
          }}
        >
          {children}
        </div>
      </DrawerPrimitive.Content>
    </DrawerPortal>
  );
});
DrawerContent.displayName = "DrawerContent";

const DrawerHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("grid gap-1.5 p-4 text-center sm:text-left", className)}
    {...props}
  />
);
DrawerHeader.displayName = "DrawerHeader";

/**
 * Sticky footer that sits inside the scroll container,
 * and adds padding for safe area + keyboard height.
 */
const DrawerFooter = ({
  className,
  style,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      // sticky so it "lifts" with the keyboard rather than being hidden under it
      "sticky bottom-0 z-10 -mx-4 border-t border-grayCustom bg-black",
      "p-4 flex flex-col gap-2",
      className
    )}
    style={{
      paddingBottom: `calc(env(safe-area-inset-bottom) + var(--kb, 0px))`,
      ...style,
    }}
    {...props}
  />
);
DrawerFooter.displayName = "DrawerFooter";

const DrawerTitle = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Title
    ref={ref}
    className={cn(
      "mb-2 mt-8 text-lg font-semibold leading-none tracking-tight text-white",
      className
    )}
    {...props}
  />
));
DrawerTitle.displayName = DrawerPrimitive.Title.displayName;

const DrawerDescription = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Description
    ref={ref}
    className={cn("mb-4 text-sm text-grayCustom2", className)}
    {...props}
  />
));
DrawerDescription.displayName = DrawerPrimitive.Description.displayName;

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
};
