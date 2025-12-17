'use client';

import { QRCodeCanvas } from 'qrcode.react';

export interface QRCodeProps {
  phoneNumber: string;
  restaurantName: string;
}

export const WhatsAppQRCode = ({
  phoneNumber,
  restaurantName,
}: QRCodeProps) => {
  if (!phoneNumber) return null;
  const message = `Hi, I want to order from ${restaurantName}`;
  const encodedMessage = encodeURIComponent(message);
  const link = `https://api.whatsapp.com/send/?phone=${phoneNumber}&text=${encodedMessage}&type=phone_number&app_absent=0`;

  return (
    <QRCodeCanvas
      value={link}
      size={256}
      level="H"
      marginSize={8}
      bgColor="#ffffff"
      fgColor="#000000"
    />
  );
};
