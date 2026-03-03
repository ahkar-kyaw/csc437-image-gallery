import { Routes, Route } from "react-router"
import { MainLayout } from "./MainLayout.jsx";
import { AllImages } from "./images/AllImages.jsx";
import { ImageDetails } from "./images/ImageDetails.jsx";
import { UploadPage } from "./UploadPage.jsx";
import { LoginPage } from "./LoginPage.jsx";
import { VALID_ROUTES } from "./shared/ValidRoutes.js";

function App() {
    return (
        <Routes>
            <Route path={VALID_ROUTES.HOME} element={<MainLayout />}>
                <Route index element={<AllImages />} />
                <Route path={VALID_ROUTES.IMAGE_DETAILS} element={<ImageDetails />} />
                <Route path={VALID_ROUTES.UPLOAD} element={<UploadPage />} />
                <Route path={VALID_ROUTES.LOGIN} element={<LoginPage />} />
                <Route path="*" element={<h1>404 Not Found</h1>} />
            </Route>
        </Routes>
    );
}

export default App;
