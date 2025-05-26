import Image from "next/image";

export default function Home() {
  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[496px]">
          <div className="w-fit mb-12 flex flex-row items-center justify-center gap-2">
            <Image
              src="/assets/icons/logo-icon.svg"
              height={1000}
              width={1000}
              alt="logo"
              className=" h-10 w-fit"
            />
            <div className="text-lg text-white font-bold">MediSync</div>
          </div>
        </div>

      </section>
    </div>
  );
}
