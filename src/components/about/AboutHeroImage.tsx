import Image from "next/image";

export default function AboutHeroImage() {
  return (
    <section className="max-w-7xl mx-auto px-6 pb-12">
      <Image
        src="/assets/team-collaboration.jpg"
        width={1280}
        height={640}
        alt="Team collaboration"
        className="w-full h-[500px] object-cover rounded-2xl shadow-[0px_5px_10px_rgba(0,0,0,0.25)]"
      />
    </section>
  );
}
