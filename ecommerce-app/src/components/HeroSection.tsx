import Link from "next/link";

export function HeroSection() {
  return (
    <section className="w-full bg-gradient-to-r from-indigo-400 to-blue-600 py-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center px-4 gap-6">
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            ¡Bienvenido a tu nueva experiencia de compras!
          </h1>
          <p className="text-md md:text-lg text-indigo-100 mb-6">
            Descubre productos exclusivos, ofertas y la mejor atención. Todo en un
            solo lugar.
          </p>
          <Link href="/products">
            <button className="bg-white text-indigo-700 font-semibold px-6 py-2 rounded-lg shadow hover:bg-indigo-100 transition">
              Ver catálogo
            </button>
          </Link>
        </div>
        <div className="flex-1 flex justify-center">
          <img
            src="/images/hero-ecommerce.png"
            alt="Hero Ecommerce"
            className="w-64 h-64 object-contain drop-shadow-xl transition-transform duration-500"
          />
        </div>
      </div>
    </section>
  );
}