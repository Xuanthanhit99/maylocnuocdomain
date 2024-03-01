import "./globals.css";
// import { Inter } from 'next/font/google'
import MenuComponentComponent from "../src/components/menu/index";
import FooterComponent from "../src/components/footer/index";
import SocialSupport from "../src/components/menu-chat/index";
import CustomInput from "@/components/FormItemFloatLabel/CustomInput";
import CustomTextArea from "@/components/FormItemFloatLabel/CustomTextArea";
import { Button } from "antd";
import { useState } from "react";
import Provider from "../src/components/Provider/Provider";
import { AuthContextProvider } from "./context/AuthContext";
// import Provider from '@/components/Provider/Provider'
// const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
      <AuthContextProvider>
        <Provider>
            <div className="relative h-full">
              <MenuComponentComponent />
              {children}
              <div className="fixed social-support">
                <SocialSupport />
              </div>
              <FooterComponent />
            </div>
        </Provider>
        </AuthContextProvider>
      </body>
    </html>
  );
}
