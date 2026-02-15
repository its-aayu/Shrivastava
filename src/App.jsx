import Button from "./Components/Button";
import Footer from "./Components/Footer";
import Navbar from "./Components/Navbar";
import Card from "./Components/Card";

function App() {
  return (
    <div className="min-h-screen bg-slate-100 py-10">
      <div className="flex flex-col gap-4">
        
        {/* Heading */}
        <h2 className="text-xl font-bold text-slate-800">
          1. Button
        </h2>

        {/* Card */}
        <div className="bg-[#3C3288] p-8 rounded-xl shadow flex gap-8 flex-wrap">
          <Button variant="primary" size="sm">Primary Small</Button>
          <Button variant="primary" size="md">Primary Medium</Button>
          <Button variant="primary" size="lg">Primary Large</Button>
          <Button variant="outline" size="md">Outline Medium</Button>
          <Button variant="ghost" size="md">Ghost Medium</Button>
          <Button variant="primary" size="md" disabled>Disabled</Button>
        </div>
        
        <div className="flex flex-col gap-6">
          <h2 className="text-xl font-bold text-slate-800">
            2. Footer
          </h2>
          <div className="bg-[#3C3288] p-4 rounded-lg">
            <Footer />
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <h2 className="text-xl font-bold text-slate-800">
            3. Navbar
          </h2>
          <div className="bg-[#3C3288] p-4 rounded-lg">
            <Navbar />
          </div>
        </div>  

        <div className="flex flex-col gap-6">
          <h2 className="text-xl font-bold text-slate-800">
            4. Card
          </h2>
          <div className="flex flex-row gap-10 max-w-4xl mx-auto">
            <Card
              title="Basic Plan"
              price="$19"
              subtitle="Perfect for individuals"
              features={["Feature 1", "Feature 2", "Feature 3"]}
              variant="basic"
            />

            <Card
              title="Featured Plan"
              price="$29"
              subtitle="Best for professionals"
              features={["Feature 1", "Feature 2", "Feature 3", "Feature 4"]}
              variant="featured"
            />

            <Card
              title="Premium Plan"
              price="$49"
              subtitle="Ideal for businesses"
              features={["Feature 1", "Feature 2", "Feature 3", "Feature 4", "Feature 5"]}
              variant="premium"
            />
          </div>
        </div>  
      </div>
    </div>
  );
}

export default App;
