import { ShieldCheck, CreditCard, Truck, Users } from "lucide-react"

function Policy() {
  return (
    <div className="max-w-5xl mx-auto py-16 px-6 space-y-12">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900">Rental Policies</h1>
        <p className="mt-3 text-gray-600 text-lg">
          Please review our policies before booking to ensure a smooth and hassle-free experience.
        </p>
      </div>

      {/* Policies */}
      <div className="grid gap-10 md:grid-cols-2">
        {/* Rental Policy */}
        <div className="p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition">
          <div className="flex items-center gap-3 mb-4">
            <ShieldCheck className="w-6 h-6 text-green-500" />
            <h2 className="text-2xl font-semibold text-gray-900">Rental Policy</h2>
          </div>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Rental duration is based on package selection (4–24 hours).</li>
            <li>Deposit may be required depending on the package.</li>
            <li>Customer is responsible for equipment safety and proper use.</li>
          </ul>
        </div>

        {/* Payment Policy */}
        <div className="p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition">
          <div className="flex items-center gap-3 mb-4">
            <CreditCard className="w-6 h-6 text-blue-500" />
            <h2 className="text-2xl font-semibold text-gray-900">Payment Policy</h2>
          </div>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>50% down payment required to confirm reservation.</li>
            <li>Remaining balance payable on the event day.</li>
            <li>Cancellations 7 days prior are refundable (minus processing fees).</li>
          </ul>
        </div>

        {/* Delivery & Setup */}
        <div className="p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition">
          <div className="flex items-center gap-3 mb-4">
            <Truck className="w-6 h-6 text-orange-500" />
            <h2 className="text-2xl font-semibold text-gray-900">Delivery & Setup</h2>
          </div>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Free delivery within 10km of service area (additional fees may apply).</li>
            <li>Setup and soundcheck are included for most packages.</li>
            <li>Outdoor events may require additional equipment or generator support.</li>
          </ul>
        </div>

        {/* Customer Responsibility */}
        <div className="p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-6 h-6 text-purple-500" />
            <h2 className="text-2xl font-semibold text-gray-900">Customer Responsibility</h2>
          </div>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Ensure safe access for delivery and setup crew.</li>
            <li>Provide a secure location for equipment during the event.</li>
            <li>Liable for damages caused by misuse, negligence, or third parties.</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Policy
