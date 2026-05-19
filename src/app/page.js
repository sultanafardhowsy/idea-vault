
import HomeFeatured from "./homefeatured/page";
import BannerPage from "./main/banner/page";
import ExtraSection from "./main/extra-section/page";


export default function Home() {
  return (
    
    <div className="mb-10">
      <BannerPage />
      <HomeFeatured />
      <ExtraSection />
    </div>
  );
}
