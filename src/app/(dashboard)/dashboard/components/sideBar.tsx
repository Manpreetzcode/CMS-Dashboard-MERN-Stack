import Link from "next/link";
import icons from "./icon";
import Navigation, {NavItemData, subMenuInfo} from "./navigation";

const Nav = new Navigation();


export function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      {open ? (
        <path d="M4 4l12 12M16 4L4 16" stroke="#374151" strokeWidth="1.8" strokeLinecap="round" />
      ) : (
        <>
          <path d="M3 5h14M3 10h14M3 15h14" stroke="#374151" strokeWidth="1.8" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}


export function SidebarContent({
  active,
  onSelect,
}: {
  active: string;
  onSelect: (label: string, link: string) => void;
}) {
  return (
    <>
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-2 mb-10">
        {icons.logo()}
        <span className="text-base font-bold text-gray-900 tracking-tight">Dashboard</span>
      </div>



      {/* Main Menu */}
      <div className="mb-1">
        <p className="px-3 mb-1 text-[10px] font-semibold tracking-widest text-gray-400 uppercase">
          Main Menu
        </p>
        <nav className="flex flex-col gap-0.5">
          {Nav.navMain.map((item) => (
            <NavItem
              key={item.label}
              item={{ ...item, active: active === item.label }}
              onClick={onSelect}
            />
          ))}
        </nav>
      </div>

      {/* Features */}
      { Nav.navFeatures.length > 0 && (
      <div className="mt-4 mb-1">
        <p className="px-3 mb-1 text-[10px] font-semibold tracking-widest text-gray-400 uppercase">
          Features
        </p>
        <nav className="flex flex-col gap-0.5">
          {Nav.navFeatures.map((item) => (
            <NavItem
              key={item.label}
              item={{ ...item, active: active === item.label }}
              onClick={onSelect}
            />
          ))}
        </nav>
      </div>
      ) }
      

      {/* General */}
      { Nav.navGeneral && Nav.navGeneral.length > 0 && (
      <div className="mt-4 mb-1 flex-1">
        <p className="px-3 mb-1 text-[10px] font-semibold tracking-widest text-gray-400 uppercase">
          General
        </p>
        <nav className="flex flex-col gap-0.5">
          {Nav.navGeneral.map((item) => (
            <NavItem
              key={item.label}
              item={{ ...item, active: active === item.label }}
              onClick={onSelect}
            />
          ))}
        </nav>
      </div>
      )}
    </>
  );
}


interface NavItemProps {
  item: NavItemData & { active: boolean };
  onClick: (label: string, link: string) => void;
}

function NavItem({ item, onClick }: NavItemProps) {
  const Icon = icons[item.icon]; 

  return (
    <div
      className={`sideNav flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer group transition-all duration-150 ${
        item.active
          ? "bg-gray-800 text-white"
          : "text-gray-500 hover:bg-gray-100 hover:text-gray-800"
      }`}
    >
      <div className="flex items-center gap-3" onClick={() => onClick(item.label, item.link) }>
        <span className={item.active ? "text-white" : "text-gray-400 group-hover:text-gray-600"}>
          <Icon />
        </span>
        <span className={`text-sm font-medium ${item.active ? "text-white" : "text-gray-600"}`}>
          {item.label}
        </span>
      </div>
      {item.badge !== null && (
        <span
          className={`text-xs font-semibold px-1.5 py-0.5 rounded-md ${
            item.active ? "bg-gray-600 text-gray-200" : "text-gray-400"
          }`}
        >
          {item.badge}
        </span>
      )}
      {item.subMenu && item.subMenu.length > 0 && (
        <div className="sub-sideNav hide">
          <ul>
            {item.subMenu.map((subItem: subMenuInfo, index: number) => (
              <li key={index}>
                <Link href={subItem.link}>{subItem.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}