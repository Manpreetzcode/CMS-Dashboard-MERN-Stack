import {IconKey} from "./icon";

export interface subMenuInfo{
    label: string;
    link: string;
  }

export interface NavItemData {
  label: string;
  icon: IconKey;
  link: string;
  badge: number | null;
  subMenu ?: subMenuInfo[];
}

export default class Navigation {
  navMain: NavItemData[];
  navFeatures: NavItemData[]  = [];
  navGeneral: NavItemData[] = [];

  constructor() {
    this.navMain = [
      { label: "Dashboard", icon: "dashboard", badge: null, link: "/dashboard/" },
      { label: "Post", icon: "invoices", badge: null, link: "/dashboard/post",
        subMenu : [{  label: "Add Post", link: "/dashboard/post/add-post" }, {  label: "Categories", link: "/dashboard/post/categories" }]
       },
      { label: "Page", icon: "invoices", badge: null, link: "/dashboard/page",
        subMenu : [{  label: "Add Page", link: "/dashboard/page/add-page" }]
      },
      { label: "Media", icon: "media", badge: null , link: "/dashboard/media"},
    ];

    // this.navFeatures = [
    //   { label: "Feedback", icon: "feedback", badge: null, link: "/dashboard/" },
    // ];

    this.navGeneral = [
      { label: "About Me", icon: "help", badge: null, link: "/dashboard/about"},
    ];
  }
}