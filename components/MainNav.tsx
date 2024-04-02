import Link from "next/link";

const MainNav = () => {
  return (
    <nav className="bg-gray-900 text-white p-4">
      <div className="flex justify">
        <Link href="/" passHref>
          <div className="mr-4 cursor-pointer hover:underline">Home</div>
        </Link>
        <Link href="/top" passHref>
          <div className="cursor-pointer hover:underline">Top 50</div>
        </Link>
      </div>
    </nav>
  );
};

export default MainNav;
