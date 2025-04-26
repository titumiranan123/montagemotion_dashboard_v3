import { IPackage } from "@/interface/interface";

interface PackageCardProps {
  pkg: IPackage;
}

const PackageCard = ({ pkg }: PackageCardProps) => {
  return (
    <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Price Section (Top) */}
      <div className="text-white p-6 text-center border-b">
        <div className="text-4xl font-bold ">
          {pkg.currency}{pkg.price}
          {pkg.pricing_type === 'single' && <span className="text-lg font-normal">/{pkg.unit}</span>}
        </div>
        {pkg.pricing_type === 'combo' && (
          <div className="mt-1 text-sm text-green-600">
            Save 33% compared to individual purchases
          </div>
        )}
      </div>

      {/* Title & Description */}
      <div className="p-6 text-white">
        <h3 className="text-xl font-semibold ">{pkg.title}</h3>
        <p className="mt-2 ">{pkg.description}</p>
      </div>

      {/* Features List */}
      <div className="px-6 pb-4">
        <ul className="space-y-3 text-white">
          {pkg.features
            .sort((a, b) => a.position - b.position)
            .map((feature, index) => (
              <li key={index} className="flex items-start">
                {feature.is_active ? (
                  <>
                    <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{feature.feature}</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 text-gray-300 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span className="text-gray-400">{feature.feature}</span>
                  </>
                )}
              </li>
            ))}
        </ul>
      </div>

      {/* Note Section */}
      <div className="px-6 py-4 text-white border-t">
        <p className="text-sm text-gray-500">{pkg.note}</p>
      </div>

      {/* Purchase Button */}
      <div className="p-6">
        <a
          href={pkg.purchase_link}
          className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition-colors"
        >
          Purchase Now
        </a>
      </div>
    </div>
  );
};
export default PackageCard