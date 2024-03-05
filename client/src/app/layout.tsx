import type { Metadata } from "next";
import { Inter } from "next/font/google";
import 'bootstrap/dist/css/bootstrap.css'
import StoreProvider from "@/providers/storeProvider";
import apiClient from "@/api/build_client";
import Header from "@/components/header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const client = apiClient();
  const user = await client.get('/api/users/currentuser');
  console.log(user.data.currentUser);
  
  return (
    <html lang="en">
      <body className={inter.className}>
        <StoreProvider initialState={{ currentUser: user.data.currentUser }}>
          <Header/>
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}
