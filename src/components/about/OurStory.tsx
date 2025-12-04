import Image from 'next/image'

export default function OurStory() {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-14">
          <div className="w-full lg:w-[50%] shrink-0">
            <Image
              src="/assets/workspace.jpg"
              alt="Office workspace"
              width={616}
              height={440}
              className="w-full h-auto rounded-2xl shadow-[0px_5px_10px_rgba(0,0,0,0.25)]"
              priority={false}
            />
          </div>
          <div className="flex-1">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 leading-10">Our Story</h2>
            <div className="space-y-[20px]">
              <p className="text-lg md:text-md  text-justify leading-[25px] text-gray-600">
                Inventrix was founded in 2020 by a team of entrepreneurs who experienced firsthand the challenges of managing inventory across multiple locations. After struggling with outdated spreadsheets and complex enterprise software, they knew there had to be a better way.
              </p>
              <p className="text-lg md:text-md leading-[30px] text-gray-600">
                What started as a simple tool for their own business quickly evolved into a comprehensive platform that thousands of businesses now rely on daily. We&apos;ve grown from a small startup to a thriving company, but our core mission remains the same: make inventory management simple, accessible, and powerful for everyone.
              </p>
              <p className="text-lg md:text-md leading-[30px] text-gray-600">
                Today, we&apos;re proud to serve over 5,000 businesses across 30+ countries, helping them save time, reduce costs, and grow with confidence. Our journey is just beginning, and we&apos;re excited to continue innovating and supporting businesses worldwide.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}