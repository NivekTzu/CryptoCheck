import Link from "next/link";
import ToggleMode from "./ToggleMode";

const MainNav = () => {
  return (
    <nav>
      <div className="flex justify-between">
        <div className="flex items-center gap-4">
          <Link href="/">HomePage</Link>
          <Link href="/CreateNewList">Custom List</Link>
          <Link href="/Top100">Top 100</Link>
        </div>

        <div className="flex items-center gap-4">
          <ToggleMode />
        </div>
      </div>
    </nav>
  );
};

export default MainNav;
