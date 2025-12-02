"use client";

import { useCartStore } from "@/lib/store";
import { CartNotification } from "@/components/cart-notification";
import { useState, useEffect } from "react";

export function CartNotificationWrapper() {
  const { lastAddedItem, clearLastAddedItem } = useCartStore();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (lastAddedItem) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [lastAddedItem]);

  const handleClose = () => {
    setIsOpen(false);
    clearLastAddedItem();
  };

  return (
    <CartNotification
      isOpen={isOpen}
      onClose={handleClose}
      product={lastAddedItem}
    />
  );
}

