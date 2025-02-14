const Footer = () => {
  return (
    <footer className="bg-gray-200 text-black text-center py-4">
      <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-8">
        <a
          href="#"
          className="hover:underline text-sm md:text-base whitespace-nowrap"
        >
          개인정보 처리방침
        </a>
        <a
          href="#"
          className="hover:underline text-sm md:text-base whitespace-nowrap"
        >
          사이트 이용 약관
        </a>
        <div className="flex gap-1">
          <span className="font-semibold text-sm md:text-base whitespace-nowrap">
            © AlBaro.
          </span>
          <span className="text-sm md:text-base whitespace-nowrap">
            All rights Reserved
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
