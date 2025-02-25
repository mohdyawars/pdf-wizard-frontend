import React from "react";

interface FeatureSelectionProps {
  selectedFeature: string;
  setSelectedFeature: (feature: string) => void;
}

const FeatureSelection: React.FC<FeatureSelectionProps> = ({
  selectedFeature,
  setSelectedFeature,
}) => {
  return (
    <div className="flex space-x-4 mt-6">
      {["text", "images", "merge"].map((feature) => (
        <button
          key={feature}
          onClick={() => setSelectedFeature(feature)}
          className={`px-4 py-2 rounded-md text-white ${
            selectedFeature === feature ? "bg-indigo-600" : "bg-gray-500"
          }`}
        >
          {feature === "text"
            ? "Extract Text"
            : feature === "images"
            ? "Extract Images"
            : "Merge PDFs"}
        </button>
      ))}
    </div>
  );
};

export default FeatureSelection;
