import Link from "next/link";
import ToggleMode from "./ToggleMode";

const MainNav = () => {
  return (
    <nav>
      <div className="flex justify-between">
        <div className="flex items-center gap-4">
          <Link href="/">Create List</Link>
          <Link href="/top">Top 100</Link>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/">
            <ToggleMode />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default MainNav;
