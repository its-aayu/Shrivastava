
export default function Footer() {
  return (
    <footer className="bg-[#3C3288] text-indigo-100">
      <div className="max-w-7xl mx-auto px-8 py-12">

        {/* Logo */}
        <div className="flex justify-center mb-8">
          <h1 className="text-2xl font-bold tracking-wide">Name Loading</h1>
        </div>

        {/* Divider */}
        <div className="border-t border-[#FF9247] mb-8" />

        {/* Main content */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 text-sm">

          {/* Services */}
          <div>
            <h3 className="font-semibold mb-3">Services</h3>
            <ul className="space-y-2 text-indigo-300">
              <li>Digital Print</li>
              <li>Doc Print</li>
              <li>Shirt Print</li>
              <li>Sticker Print</li>
            </ul>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold mb-3">Links</h3>
            <ul className="space-y-2 text-indigo-300">
              <li>Terms of Use</li>
              <li>Privacy Policy</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-3">Contact Us</h3>
            <ul className="space-y-2 text-indigo-300">
              <li>📞 +91 546 84272</li>
              <li>✉️ Name Loading@domain.com</li>
              <li>📍 George Tower, 123, Burn Swiss</li>
            </ul>
          </div>

          {/* Map */}
          <div>
            <h3 className="font-semibold mb-3">Maps</h3>
            <div className="w-38 h-24 bg-indigo-200 rounded" />
          </div>

          {/* Social */}
          <div>
            <h3 className="font-semibold mb-3">Social Media</h3>
            <div className="flex gap-3">
              <span className="w-8 h-8 bg-indigo-700 rounded-full flex items-center justify-center">f</span>
              <span className="w-8 h-8 bg-indigo-700 rounded-full flex items-center justify-center">i</span>
              <span className="w-8 h-8 bg-indigo-700 rounded-full flex items-center justify-center">x</span>
              <span className="w-8 h-8 bg-indigo-700 rounded-full flex items-center justify-center">in</span>
            </div>
          </div>

        </div>

        {/* Bottom divider */}
        <div className="border-t border-[#FF9247] mt-10 pt-4 text-center text-xs text-indigo-400">
          © copyright Name Loading2023 all right reserved
        </div>

      </div>
    </footer>
  );
}
