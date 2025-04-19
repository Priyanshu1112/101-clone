import Footer from "../_components/Footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="mx-auto flex flex-col gap-[31px]">
      <div
        className="bg-white py-6 px-10 rounded-[16px] text-secondary-400-main "
        style={{ boxShadow: "0px 9px 21px 9px #00000008" }}
      >
        {children}
      </div>
      <Footer contact={true} />
    </div>
  );
}
