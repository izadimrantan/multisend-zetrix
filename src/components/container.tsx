import Footer from "./footer";
import Navbar from "./navbar";

export default function Container(props: any) {
  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <Navbar activeKey={props.activeKey} />
      {/* Main content */}
      <main className="mx-auto mb-auto px-4 md:px-8 lg:px-12 w-full lg:max-w-7xl">
        {props.children}
      </main>
      <Footer />
    </div>
  );
}
