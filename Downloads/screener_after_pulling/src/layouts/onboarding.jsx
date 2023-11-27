import { Routes, Route } from "react-router-dom";
import routes from "@/routes";
import { useMaterialTailwindController } from "@/context";

export function Onboarding() {
  return (
    <div className="min-h-screen bg-blue-gray-50/50">
      <div className="p-4 mt-5 md:pl-20 md:pr-20 lg:pl-40 lg:pr-40 xl:pl-40 xl:pr-40 2xl:pl-80 2xl:pr-80 relative">
        <Routes>
          {routes.map(
            ({ layout, pages }) =>
              layout === "onboarding" &&
              pages.map(({ path, element }) => (
                <Route ex path={path} element={element} />
              ))
          )}
        </Routes>
      </div>
    </div>
  );
}

Onboarding.displayName = "/src/layout/onboarding.jsx";

export default Onboarding;
