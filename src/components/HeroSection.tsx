import React from "react";

const HeroSection: React.FC = () => {
  return (
    <section className="flex flex-col gap-10 items-start relative shrink-0 w-[710px]">
      <div className="flex flex-col gap-2 items-start relative z-2 shrink-0 w-full">
        <h1 className="font-sohne leading-none min-w-full relative shrink-0 text-[76px] text-white w-min">
          <span className="block leading-[86px]">Built exclusively</span>
          <span className="block">
            <span className="leading-[86px]">{"for "}</span>
            <span
              className="bg-clip-text leading-[86px] text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(268.329deg, rgb(189, 237, 143) 51.659%, rgb(48, 134, 152) 83.972%)",
              }}
            >
              scalpers
            </span>
          </span>
        </h1>
        <p className="font-groww font-medium leading-7 relative z-2 shrink-0 text-[#989ea0] text-2xl w-[470px]">
          A trading workspace designed for one thing: speed.
        </p>
      </div>

      <button
        type="button"
        tabIndex={0}
        aria-label="Launch scalper zone"
        className="group relative shrink-0 rounded-[92px] backdrop-blur-[38px] cursor-pointer transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40"
        style={{
          border: "1.5px solid rgba(255, 255, 255, 0.04)",
          background:
            "linear-gradient(93deg, rgba(255, 255, 255, 0.01) 0.09%, rgba(142, 144, 145, 0.01) 99.91%)",
          boxShadow: "0 10px 30px 0 rgba(144, 173, 157, 0.30) inset",
        }}
      >
        <div className="flex items-center justify-center overflow-clip rounded-[inherit] px-9 py-4">
          <span
            className="bg-clip-text font-sohne leading-8 text-transparent text-xl tracking-[1.6px] uppercase"
            style={{
              backgroundImage:
                "linear-gradient(266.815deg, rgb(189, 237, 143) 3.5208%, rgb(48, 134, 152) 99.88%)",
            }}
          >
            Launch scalper zone
          </span>
        </div>
      </button>
    </section>
  );
};

export default HeroSection;
