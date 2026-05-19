import Image from "next/image";
import BannerPage from "./main/banner/page";

import HomeFeatured from "./homefeatured/page";

export default function Home() {
  return (
    
    <div className="">
      <BannerPage />
      <HomeFeatured />
    </div>
  );
}
