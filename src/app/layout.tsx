import type { Metadata } from "next";
import "./globals.css";
import Gnb from "@/component/gnb";
import { AlertText } from "./hook/useAlert";

export const metadata: Metadata = {
  title: "Todo List",
  description: "Todo List assignment for codeit",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link rel="icon" href="/img/favicon.svg" />
        <link rel="stylesheet" type="text/css" href="/XEIcon/xeicon.min.css" />
      </head>
      <body className="relative w-dvw h-dvh flex flex-col justify-start items-center">
        <Gnb></Gnb>
        {children}
        <AlertText></AlertText>
      </body>
    </html>
  );
}
