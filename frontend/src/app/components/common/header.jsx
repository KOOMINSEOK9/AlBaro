import Link from "next/link";

const Header = () => {
  return (
    <header className="bg-[#222831] text-white py-4 px-6 flex justify-between items-center">
      <Link href="/" className="text-2xl font-bold">
        AlBaro
      </Link>
      <div>김싸피님 환영합니다.</div>
    </header>
  );
};

export default Header;
