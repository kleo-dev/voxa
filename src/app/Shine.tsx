export default function Shine() {
  return (
    <div className="w-full h-[2px] mx-auto lg:w-5xl relative z-10">
      <div
        className="
          absolute left-1/2 -translate-x-1/2
          w-[99%] h-[29px] rounded-full
          filter blur-[24.5px] mix-blend-lighten opacity-30
          bg-[radial-gradient(50%_50%,_#7d7d7d_0%,_#ff961f66_100%)]
          "
      ></div>

      <div
        className="
          absolute left-1/2 -translate-x-1/2
          w-[64%] h-[17px] rounded-full
          filter blur-[40.5px] mix-blend-lighten opacity-80
          bg-[radial-gradient(50%_50%,_#7d7d7d_0%,_#ff961f66_100%)]
        "
      ></div>

      <div
        className="
          absolute left-1/2 -translate-x-1/2
          w-[60.8%] h-[17px] rounded-full
          filter blur-[7px] mix-blend-lighten opacity-20
          bg-[radial-gradient(50%_50%,_#fff_0%,_#fff6_100%)]
        "
      ></div>

      <div
        className="
          absolute left-1/2 -translate-x-1/2
          w-[43.5%] h-[5px] rounded-full
          filter blur-md mix-blend-lighten opacity-80
          bg-[radial-gradient(50%_50%,_#fff_0%,_#fff6_100%)]
        "
      ></div>

      <div
        className="
          absolute left-1/2 -translate-x-1/2
          w-[99%] h-[2px] rounded-full
          filter
          bg-[radial-gradient(50%_50%,_#fff_0%,_#c7ffee00_100%)]
        "
      ></div>

      <div
        className="
          absolute left-1/2 -translate-x-1/2
          w-full h-[398px] rounded-full
          filter blur-[135px] mix-blend-lighten opacity-10
          bg-[#b8b8b8]
        "
      ></div>
    </div>
  );
}
