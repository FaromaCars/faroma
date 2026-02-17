import Marquee from "react-fast-marquee";

export const HeaderMarquee = () => {
  return (
    <div className="w-full overflow-hidden bg-gray-800 text-white py-2">
      <Marquee className="flex" speed={75}>
        {/* LOOP 1 */}
        <span className="mx-10 shrink-0 text-sm md:text-base font-medium">
          🌍 Import & Export New & Used Vehicles Worldwide
        </span>

        {/* LOOP 2 */}
        <span className="mx-10 shrink-0 text-sm md:text-base font-medium">
          🤝 Trusted by Dealers & Individual Buyers
        </span>

        <span className="mx-10 shrink-0 text-sm md:text-base font-medium">
          🏆 Best Deals & Special Packages
        </span>
       
        <span className="mx-10 shrink-0 text-sm md:text-base font-medium">
          🚗 Faroma Motor Trading International LLC
        </span>

        {/* LOOP 2 */}
        <span className="mx-10 shrink-0 text-sm md:text-base font-medium">
          📦 Quick, Economical & Hassle-Free Delivery
        </span>

      </Marquee>
    </div>
  );
}

export default HeaderMarquee;